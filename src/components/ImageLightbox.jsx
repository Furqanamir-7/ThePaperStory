import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function isVideoSrc(src = '') {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src)
}

const MIN_SCALE = 1
const MAX_SCALE = 4

export default function ImageLightbox({
  sources,
  startIndex = 0,
  title = 'Preview',
  onClose,
}) {
  const gallery = sources?.length ? sources : []
  const [index, setIndex] = useState(startIndex)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const pointerIdRef = useRef(null)
  const startRef = useRef({ x: 0, y: 0 })
  const originOffsetRef = useRef({ x: 0, y: 0 })
  const didDragRef = useRef(false)
  const pinchRef = useRef(null)
  const stageRef = useRef(null)

  const current = gallery[index] || gallery[0]
  const isVideo = isVideoSrc(current)
  const hasGallery = gallery.length > 1
  const canZoom = !isVideo

  const resetZoom = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const goTo = (next) => {
    setIndex((next + gallery.length) % gallery.length)
    resetZoom()
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && hasGallery) goTo(index - 1)
      if (event.key === 'ArrowRight' && hasGallery) goTo(index + 1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, hasGallery, index])

  const clampOffset = (nextScale, nextOffset) => {
    const stage = stageRef.current
    if (!stage || nextScale <= 1) return { x: 0, y: 0 }
    const maxX = (stage.clientWidth * (nextScale - 1)) / 2
    const maxY = (stage.clientHeight * (nextScale - 1)) / 2
    return {
      x: Math.max(-maxX, Math.min(maxX, nextOffset.x)),
      y: Math.max(-maxY, Math.min(maxY, nextOffset.y)),
    }
  }

  // Non-passive wheel so preventDefault works for zoom
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !canZoom) return undefined

    const onWheel = (event) => {
      event.preventDefault()
      const delta = event.deltaY > 0 ? -0.15 : 0.15
      setScale((prev) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta))
        setOffset((currentOffset) => clampOffset(next, currentOffset))
        return next
      })
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [canZoom, index])

  const onDoubleClick = () => {
    if (!canZoom) return
    if (scale > 1) {
      resetZoom()
    } else {
      setScale(2.2)
      setOffset({ x: 0, y: 0 })
    }
  }

  const onPointerDown = (event) => {
    if (event.target.closest?.('button')) return
    if (event.pointerType === 'touch' && event.isPrimary === false) return

    // Pinch start (2 touches tracked via events on stage)
    pointerIdRef.current = event.pointerId
    startRef.current = { x: event.clientX, y: event.clientY }
    originOffsetRef.current = offset
    didDragRef.current = false
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (pointerIdRef.current !== event.pointerId) return

    const dx = event.clientX - startRef.current.x
    const dy = event.clientY - startRef.current.y

    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      didDragRef.current = true
    }

    if (scale > 1) {
      setOffset(clampOffset(scale, {
        x: originOffsetRef.current.x + dx,
        y: originOffsetRef.current.y + dy,
      }))
      return
    }

    // Swipe between slides when not zoomed
    if (hasGallery && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      pointerIdRef.current = null
      goTo(dx < 0 ? index + 1 : index - 1)
    }
  }

  const onPointerUp = (event) => {
    if (pointerIdRef.current !== event.pointerId) return
    pointerIdRef.current = null
    pinchRef.current = null
  }

  const onTouchStart = (event) => {
    if (!canZoom || event.touches.length !== 2) return
    const [a, b] = event.touches
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    pinchRef.current = { distance, scale }
  }

  const onTouchMove = (event) => {
    if (!canZoom || !pinchRef.current || event.touches.length !== 2) return
    event.preventDefault()
    const [a, b] = event.touches
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    const next = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, (pinchRef.current.scale * distance) / pinchRef.current.distance)
    )
    setScale(next)
    setOffset((currentOffset) => clampOffset(next, currentOffset))
  }

  if (!current) return null

  return createPortal(
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="image-lightbox-toolbar">
        <p className="image-lightbox-title">
          {title}
          {hasGallery ? ` · ${index + 1}/${gallery.length}` : ''}
        </p>
        <div className="image-lightbox-actions">
          {canZoom && (
            <>
              <button type="button" className="image-lightbox-btn" onClick={() => {
                setScale((prev) => {
                  const next = Math.min(MAX_SCALE, prev + 0.4)
                  setOffset((o) => clampOffset(next, o))
                  return next
                })
              }} aria-label="Zoom in">
                +
              </button>
              <button type="button" className="image-lightbox-btn" onClick={() => {
                setScale((prev) => {
                  const next = Math.max(MIN_SCALE, prev - 0.4)
                  setOffset((o) => clampOffset(next, o))
                  return next
                })
              }} aria-label="Zoom out">
                −
              </button>
              <button type="button" className="image-lightbox-btn" onClick={resetZoom} aria-label="Reset zoom">
                1×
              </button>
            </>
          )}
          <button type="button" className="image-lightbox-btn image-lightbox-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="image-lightbox-stage"
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {hasGallery && (
          <button
            type="button"
            className="image-lightbox-nav image-lightbox-nav--prev"
            onClick={() => goTo(index - 1)}
            aria-label="Previous"
          >
            ‹
          </button>
        )}

        <div
          className="image-lightbox-media"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          }}
        >
          {isVideo ? (
            <video
              key={current}
              src={current}
              className="image-lightbox-video"
              controls
              autoPlay
              playsInline
              muted
              loop
            />
          ) : (
            <img
              key={current}
              src={current}
              alt={title}
              className="image-lightbox-image"
              draggable={false}
            />
          )}
        </div>

        {hasGallery && (
          <button
            type="button"
            className="image-lightbox-nav image-lightbox-nav--next"
            onClick={() => goTo(index + 1)}
            aria-label="Next"
          >
            ›
          </button>
        )}
      </div>

      <p className="image-lightbox-hint">
        {canZoom
          ? 'Pinch, scroll, or double-tap to zoom · Drag to pan'
          : 'Swipe or use arrows to browse'}
      </p>
    </div>,
    document.body
  )
}

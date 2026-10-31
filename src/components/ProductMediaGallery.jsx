import { useState, useRef, useEffect, useCallback } from 'react'
import ImageLightbox from './ImageLightbox'

function isVideoSrc(src = '') {
  return typeof src === 'string' && /\.(mp4|webm|mov)(\?.*)?$/i.test(src)
}

const MIN_SCALE = 1
const MAX_SCALE = 3.5

export default function ProductMediaGallery({
  images = [],
  selectedIndex = 0,
  onSelectIndex,
  alt = 'Product image',
}) {
  const mediaList = images.length > 0 ? images : ['/wedding-invites/cover.jpg']
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const containerRef = useRef(null)
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const lastTapRef = useRef(0)
  const pinchStartRef = useRef({ dist: 0, scale: 1 })
  const mouseDragRef = useRef({ isDown: false, startX: 0, startY: 0, didMove: false })

  // Sync index from props if controlled
  useEffect(() => {
    if (selectedIndex !== undefined && selectedIndex !== currentIndex) {
      setCurrentIndex(selectedIndex)
      resetZoom()
    }
  }, [selectedIndex])

  const resetZoom = useCallback(() => {
    setScale(1)
    setPan({ x: 0, y: 0 })
    setSwipeOffset(0)
  }, [])

  const setIndex = useCallback((newIdx) => {
    const total = mediaList.length
    const bounded = (newIdx + total) % total
    setCurrentIndex(bounded)
    if (onSelectIndex) onSelectIndex(bounded)
    resetZoom()
  }, [mediaList.length, onSelectIndex, resetZoom])

  const currentMedia = mediaList[currentIndex] || mediaList[0]
  const isVideo = isVideoSrc(currentMedia)
  const hasMultiple = mediaList.length > 1
  const isZoomed = scale > 1

  // Clamp pan based on scale and container size
  const clampPan = useCallback((nextScale, nextPan) => {
    const el = containerRef.current
    if (!el || nextScale <= 1) return { x: 0, y: 0 }
    const maxX = (el.clientWidth * (nextScale - 1)) / 2
    const maxY = (el.clientHeight * (nextScale - 1)) / 2
    return {
      x: Math.max(-maxX, Math.min(maxX, nextPan.x)),
      y: Math.max(-maxY, Math.min(maxY, nextPan.y)),
    }
  }, [])

  // Non-passive wheel listener for smooth desktop zoom
  useEffect(() => {
    const el = containerRef.current
    if (!el || isVideo) return undefined

    const onWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 0.3 : -0.3
      setScale((prev) => {
        const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev + delta))
        if (next <= 1.05) {
          setPan({ x: 0, y: 0 })
          return 1
        }
        setPan((curr) => clampPan(next, curr))
        return next
      })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [isVideo, clampPan])

  // --- TOUCH HANDLERS (Mobile: Swipe when 1x, Pinch & Pan when zoomed) ---
  const handleTouchStart = (e) => {
    if (e.target.closest?.('button')) return
    if (isVideo) return

    // 2-finger Pinch
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
      pinchStartRef.current = { dist, scale }
      return
    }

    // 1-finger Touch
    if (e.touches.length === 1) {
      const t = e.touches[0]
      touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() }

      // Double-tap detection
      const now = Date.now()
      if (now - lastTapRef.current < 300) {
        // Toggle Zoom on double tap
        if (scale > 1) {
          resetZoom()
        } else {
          const el = containerRef.current
          if (el) {
            const rect = el.getBoundingClientRect()
            const xRel = (t.clientX - rect.left) / rect.width
            const yRel = (t.clientY - rect.top) / rect.height
            const targetScale = 2.4
            const targetPan = clampPan(targetScale, {
              x: (0.5 - xRel) * rect.width * (targetScale - 1),
              y: (0.5 - yRel) * rect.height * (targetScale - 1),
            })
            setScale(targetScale)
            setPan(targetPan)
          }
        }
        lastTapRef.current = 0
        return
      }
      lastTapRef.current = now
    }
  }

  const handleTouchMove = (e) => {
    if (isVideo) return

    // 2-finger Pinch move
    if (e.touches.length === 2 && pinchStartRef.current.dist > 0) {
      e.preventDefault()
      const [t1, t2] = e.touches
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY)
      const ratio = dist / pinchStartRef.current.dist
      const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStartRef.current.scale * ratio))
      setScale(nextScale)
      setPan((curr) => clampPan(nextScale, curr))
      return
    }

    // 1-finger Move
    if (e.touches.length === 1) {
      const t = e.touches[0]
      const dx = t.clientX - touchStartRef.current.x
      const dy = t.clientY - touchStartRef.current.y

      if (scale > 1) {
        // Pan when zoomed
        e.preventDefault()
        setPan((prev) => clampPan(scale, { x: prev.x + dx * 0.7, y: prev.y + dy * 0.7 }))
        touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() }
      } else if (hasMultiple) {
        // Horizontal swipe between images when scale === 1
        if (Math.abs(dx) > Math.abs(dy)) {
          e.preventDefault()
          setSwipeOffset(dx * 0.6) // elastic visual drag
        }
      }
    }
  }

  const handleTouchEnd = () => {
    if (isVideo) return

    pinchStartRef.current = { dist: 0, scale: 1 }

    if (scale < 1.1) {
      resetZoom()
    }

    if (scale === 1 && hasMultiple) {
      if (swipeOffset < -45) {
        setIndex(currentIndex + 1)
      } else if (swipeOffset > 45) {
        setIndex(currentIndex - 1)
      }
    }
    setSwipeOffset(0)
  }

  // --- MOUSE HANDLERS (Desktop: Click to Zoom, Mouse-move Pan, Drag to Swipe) ---
  const handleMouseDown = (e) => {
    if (e.target.closest?.('button')) return
    if (isVideo || e.button !== 0) return
    mouseDragRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      didMove: false,
    }
  }

  const handleMouseMove = (e) => {
    if (isVideo) return
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const xRel = (e.clientX - rect.left) / rect.width
    const yRel = (e.clientY - rect.top) / rect.height

    // If mouse is being dragged
    if (mouseDragRef.current.isDown) {
      const dx = e.clientX - mouseDragRef.current.startX
      const dy = e.clientY - mouseDragRef.current.startY
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        mouseDragRef.current.didMove = true
      }

      if (scale === 1 && hasMultiple) {
        setSwipeOffset(dx * 0.5)
      } else if (scale > 1) {
        // Direct pan with dragging
        setPan((prev) => clampPan(scale, { x: prev.x + dx * 0.7, y: prev.y + dy * 0.7 }))
        mouseDragRef.current.startX = e.clientX
        mouseDragRef.current.startY = e.clientY
      }
      return
    }

    // When zoomed in on desktop: follow mouse position smoothly
    if (scale > 1 && !mouseDragRef.current.isDown) {
      const targetPan = clampPan(scale, {
        x: (0.5 - xRel) * rect.width * (scale - 1),
        y: (0.5 - yRel) * rect.height * (scale - 1),
      })
      setPan(targetPan)
    }
  }

  const handleMouseUp = (e) => {
    if (e.target.closest?.('button')) return
    if (isVideo) return
    const { isDown, didMove, startX } = mouseDragRef.current
    mouseDragRef.current.isDown = false

    if (scale === 1 && hasMultiple && didMove) {
      const dx = e.clientX - startX
      if (dx < -50) {
        setIndex(currentIndex + 1)
      } else if (dx > 50) {
        setIndex(currentIndex - 1)
      }
      setSwipeOffset(0)
      return
    }
    setSwipeOffset(0)

    // Click without drag: Toggle zoom on desktop!
    if (!didMove && isDown) {
      const el = containerRef.current
      if (!el) return
      if (scale > 1) {
        resetZoom()
      } else {
        const rect = el.getBoundingClientRect()
        const xRel = (e.clientX - rect.left) / rect.width
        const yRel = (e.clientY - rect.top) / rect.height
        const targetScale = 2.4
        const targetPan = clampPan(targetScale, {
          x: (0.5 - xRel) * rect.width * (targetScale - 1),
          y: (0.5 - yRel) * rect.height * (targetScale - 1),
        })
        setScale(targetScale)
        setPan(targetPan)
      }
    }
  }

  const handleMouseLeave = () => {
    mouseDragRef.current.isDown = false
    setSwipeOffset(0)
  }

  const zoomIn = (e) => {
    e.stopPropagation()
    setScale((prev) => {
      const next = Math.min(MAX_SCALE, prev + 0.5)
      setPan((curr) => clampPan(next, curr))
      return next
    })
  }

  const zoomOut = (e) => {
    e.stopPropagation()
    setScale((prev) => {
      const next = Math.max(MIN_SCALE, prev - 0.5)
      if (next <= 1.05) {
        setPan({ x: 0, y: 0 })
        return 1
      }
      setPan((curr) => clampPan(next, curr))
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Main Interactive Stage Container (4:5 Aspect Ratio) */}
      <div
        ref={containerRef}
        className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-paperstory-wash/50 border border-paperstory-maroon/15 shadow-inner touch-none ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Media Container with smooth transform */}
        <div
          className="h-full w-full flex items-center justify-center will-change-transform"
          style={{
            transform: `translate3d(${pan.x + swipeOffset}px, ${pan.y}px, 0) scale(${scale})`,
            transition: swipeOffset === 0 && !mouseDragRef.current.isDown ? 'transform 0.15s ease-out' : 'none',
          }}
        >
          {isVideo ? (
            <video
              src={currentMedia}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover pointer-events-auto"
            />
          ) : (
            <img
              src={currentMedia}
              alt={`${alt} view ${currentIndex + 1}`}
              draggable={false}
              className="h-full w-full object-cover pointer-events-none"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/wedding-invites/cover.jpg'
              }}
            />
          )}
        </div>

        {/* Top-Left: Slide Counter & Swipe Hint */}
        {hasMultiple && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 pointer-events-none">
            <span className="rounded-full bg-paperstory-charcoal/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white shadow-xs tabular-nums">
              {currentIndex + 1} / {mediaList.length}
            </span>
            <span className="hidden sm:inline-block rounded-full bg-white/90 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-paperstory-maroon shadow-xs">
              Swipe or click to browse
            </span>
          </div>
        )}

        {/* Top-Right: Zoom Controls & Fullscreen Lightbox Button */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {!isVideo && (
            <div className="flex items-center rounded-full bg-white/95 backdrop-blur-md border border-paperstory-maroon/20 p-1 shadow-md gap-1">
              {isZoomed ? (
                <>
                  <button
                    type="button"
                    onClick={zoomOut}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-paperstory-maroon hover:bg-paperstory-maroon hover:text-white transition cursor-pointer"
                    title="Zoom Out"
                    aria-label="Zoom Out"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      resetZoom()
                    }}
                    className="flex h-7 px-2 items-center justify-center rounded-full text-[11px] font-bold bg-paperstory-maroon text-white hover:bg-paperstory-maroon/90 transition cursor-pointer"
                    title="Reset to 1x"
                  >
                    1×
                  </button>
                  <button
                    type="button"
                    onClick={zoomIn}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-paperstory-maroon hover:bg-paperstory-maroon hover:text-white transition cursor-pointer"
                    title="Zoom In"
                    aria-label="Zoom In"
                  >
                    +
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setScale(2.4)
                    setPan({ x: 0, y: 0 })
                  }}
                  className="flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold text-paperstory-maroon hover:bg-paperstory-maroon hover:text-white transition cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Zoom</span>
                </button>
              )}

              {/* Fullscreen Expand Lightbox */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowLightbox(true)
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-paperstory-maroon hover:bg-paperstory-maroon hover:text-white transition cursor-pointer"
                title="Fullscreen View"
                aria-label="Fullscreen View"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Arrows (Prev / Next) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIndex(currentIndex - 1)
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-paperstory-maroon shadow-md border border-paperstory-maroon/15 hover:bg-paperstory-maroon hover:text-white transition active:scale-95 cursor-pointer"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIndex(currentIndex + 1)
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-paperstory-maroon shadow-md border border-paperstory-maroon/15 hover:bg-paperstory-maroon hover:text-white transition active:scale-95 cursor-pointer"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Bottom Interactive Gestures Hint */}
        <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center pointer-events-none px-4">
          <span className="rounded-full bg-paperstory-charcoal/75 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-white shadow-xs">
            {isZoomed
              ? 'Drag or move mouse to pan · Tap 1× to reset'
              : hasMultiple
                ? 'Pinch or click to zoom · Swipe to browse'
                : 'Pinch on mobile · Click or scroll to zoom'}
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {mediaList.map((img, idx) => {
            const thumbIsVideo = isVideoSrc(img)
            const isActive = currentIndex === idx
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setIndex(idx)}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg border-2 transition cursor-pointer ${isActive
                    ? 'border-paperstory-maroon ring-2 ring-paperstory-maroon/30 shadow-xs'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-paperstory-maroon/30'
                  }`}
                aria-label={`View photo ${idx + 1}`}
              >
                {thumbIsVideo ? (
                  <video src={img} className="h-full w-full object-cover pointer-events-none" />
                ) : (
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover pointer-events-none"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/wedding-invites/cover.jpg'
                    }}
                  />
                )}
                {isActive && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-paperstory-maroon" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Optional Fullscreen Lightbox */}
      {showLightbox && (
        <ImageLightbox
          sources={mediaList}
          startIndex={currentIndex}
          title={alt}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </div>
  )
}

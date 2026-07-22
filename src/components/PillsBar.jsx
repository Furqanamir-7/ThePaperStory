import { useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DRAG_THRESHOLD_PX = 10
const RESUME_DELAY_MS = 1500
const MARQUEE_DURATION_SEC = 38

function PillLinks({ items, suffix = '', hidden = false, blockClickRef }) {
  return items.map((item) => (
    <Link
      key={`${item.key}${suffix}`}
      to={item.to}
      className={`pills-bar-item${item.active ? ' pills-bar-item--active' : ''}`}
      aria-current={hidden ? undefined : item.active ? 'page' : undefined}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      draggable={false}
      data-pill-to={item.to}
      onClick={(event) => {
        // Block native click after we already navigated on pointerup, or after a drag
        if (blockClickRef?.current) {
          event.preventDefault()
          event.stopPropagation()
        }
      }}
    >
      {item.label}
    </Link>
  ))
}

export default function PillsBar({ items, ariaLabel = 'Filter', static: isStatic = false }) {
  const navigate = useNavigate()
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const halfWidthRef = useRef(0)
  const pausedRef = useRef(false)
  const pointerIdRef = useRef(null)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const didDragRef = useRef(false)
  const activeRef = useRef(false)
  const blockClickRef = useRef(false)
  const resumeTimerRef = useRef(null)
  const rafRef = useRef(null)
  const lastTsRef = useRef(0)
  const tapToRef = useRef(null)

  const applyTransform = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
  }, [])

  const wrapOffset = useCallback(() => {
    const half = halfWidthRef.current
    if (half <= 0) return
    while (offsetRef.current <= -half) offsetRef.current += half
    while (offsetRef.current > 0) offsetRef.current -= half
  }, [])

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    halfWidthRef.current = track.scrollWidth / 2
    wrapOffset()
    applyTransform()
  }, [applyTransform, wrapOffset])

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
  }, [])

  const scheduleResume = useCallback(() => {
    clearResumeTimer()
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false
      lastTsRef.current = 0
      resumeTimerRef.current = null
    }, RESUME_DELAY_MS)
  }, [clearResumeTimer])

  useEffect(() => {
    if (isStatic) return undefined

    measure()

    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return undefined

    const resizeObserver = new ResizeObserver(() => measure())
    resizeObserver.observe(track)
    resizeObserver.observe(viewport)

    const tick = (timestamp) => {
      if (!lastTsRef.current) lastTsRef.current = timestamp
      const deltaMs = timestamp - lastTsRef.current
      lastTsRef.current = timestamp

      const half = halfWidthRef.current
      if (!pausedRef.current && half > 0) {
        const speed = half / MARQUEE_DURATION_SEC
        offsetRef.current -= (speed * deltaMs) / 1000
        wrapOffset()
        applyTransform()
      }

      rafRef.current = window.requestAnimationFrame(tick)
    }

    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      resizeObserver.disconnect()
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
      clearResumeTimer()
    }
  }, [isStatic, items, measure, wrapOffset, applyTransform, clearResumeTimer])

  const onPointerDown = (event) => {
    if (event.button != null && event.button !== 0) return

    const link = event.target.closest?.('[data-pill-to]')
    tapToRef.current = link?.getAttribute('data-pill-to') || null

    pausedRef.current = true
    clearResumeTimer()
    activeRef.current = true
    didDragRef.current = false
    blockClickRef.current = false
    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    startOffsetRef.current = offsetRef.current
  }

  const onPointerMove = (event) => {
    if (!activeRef.current || pointerIdRef.current !== event.pointerId) return

    const deltaX = event.clientX - startXRef.current

    if (!didDragRef.current && Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
      didDragRef.current = true
      blockClickRef.current = true
      tapToRef.current = null
      const viewport = viewportRef.current
      if (viewport?.setPointerCapture) {
        try {
          viewport.setPointerCapture(event.pointerId)
        } catch {
          /* ignore */
        }
      }
    }

    if (!didDragRef.current) return

    offsetRef.current = startOffsetRef.current + deltaX
    wrapOffset()
    applyTransform()
  }

  const endDrag = (event) => {
    if (!activeRef.current) return
    if (event?.pointerId != null && pointerIdRef.current !== event.pointerId) return

    const wasDrag = didDragRef.current
    const to = tapToRef.current

    activeRef.current = false
    didDragRef.current = false
    pointerIdRef.current = null
    tapToRef.current = null

    const viewport = viewportRef.current
    if (event?.pointerId != null && viewport?.releasePointerCapture) {
      try {
        if (viewport.hasPointerCapture?.(event.pointerId)) {
          viewport.releasePointerCapture(event.pointerId)
        }
      } catch {
        /* ignore */
      }
    }

    scheduleResume()

    if (!wasDrag && to) {
      // Navigate on tap so touch works even when the browser swallows the click
      blockClickRef.current = true
      window.setTimeout(() => {
        blockClickRef.current = false
      }, 300)
      navigate(to)
    }
  }

  if (isStatic) {
    return (
      <nav aria-label={ariaLabel} className="pills-bar">
        <p className="pills-bar-label">Quick filter</p>
        <div className="pills-bar-track-wrap pills-bar-track-wrap--static">
          <div className="pills-bar-scroll pills-bar-scroll--static">
            <PillLinks items={items} />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav aria-label={ariaLabel} className="pills-bar">
      <p className="pills-bar-label">Quick filter</p>
      <div className="pills-bar-track-wrap">
        <div className="pills-bar-fade pills-bar-fade--left" aria-hidden="true" />
        <div
          ref={viewportRef}
          className="pills-bar-scroll pills-bar-scroll--marquee"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div ref={trackRef} className="pills-bar-marquee-track">
            <PillLinks items={items} blockClickRef={blockClickRef} />
            <PillLinks items={items} suffix="-dup" hidden blockClickRef={blockClickRef} />
          </div>
        </div>
        <div className="pills-bar-fade pills-bar-fade--right" aria-hidden="true" />
      </div>
    </nav>
  )
}

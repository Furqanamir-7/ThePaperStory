import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const DRAG_THRESHOLD_PX = 6
const RESUME_DELAY_MS = 1500
const MARQUEE_DURATION_SEC = 38

function PillLinks({ items, suffix = '', hidden = false, suppressNavRef }) {
  return items.map((item) => (
    <Link
      key={`${item.key}${suffix}`}
      to={item.to}
      className={`pills-bar-item${item.active ? ' pills-bar-item--active' : ''}`}
      aria-current={hidden ? undefined : item.active ? 'page' : undefined}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      draggable={false}
      onClick={(event) => {
        if (suppressNavRef?.current) {
          event.preventDefault()
          event.stopPropagation()
          suppressNavRef.current = false
        }
      }}
    >
      {item.label}
    </Link>
  ))
}

export default function PillsBar({ items, ariaLabel = 'Filter', static: isStatic = false }) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const halfWidthRef = useRef(0)
  const pausedRef = useRef(false)
  const draggingRef = useRef(false)
  const pointerIdRef = useRef(null)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const suppressNavRef = useRef(false)
  const resumeTimerRef = useRef(null)
  const rafRef = useRef(null)
  const lastTsRef = useRef(0)

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

  const pauseInteraction = useCallback(() => {
    pausedRef.current = true
    clearResumeTimer()
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

    pauseInteraction()
    draggingRef.current = true
    suppressNavRef.current = false
    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    startOffsetRef.current = offsetRef.current

    const viewport = viewportRef.current
    if (viewport?.setPointerCapture) {
      try {
        viewport.setPointerCapture(event.pointerId)
      } catch {
        /* ignore */
      }
    }
  }

  const onPointerMove = (event) => {
    if (!draggingRef.current || pointerIdRef.current !== event.pointerId) return

    const deltaX = event.clientX - startXRef.current
    if (Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
      suppressNavRef.current = true
    }

    offsetRef.current = startOffsetRef.current + deltaX
    wrapOffset()
    applyTransform()
  }

  const endDrag = (event) => {
    if (!draggingRef.current) return
    if (event?.pointerId != null && pointerIdRef.current !== event.pointerId) return

    draggingRef.current = false
    pointerIdRef.current = null

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

    if (suppressNavRef.current) {
      window.setTimeout(() => {
        suppressNavRef.current = false
      }, 50)
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
            <PillLinks items={items} suppressNavRef={suppressNavRef} />
            <PillLinks items={items} suffix="-dup" hidden suppressNavRef={suppressNavRef} />
          </div>
        </div>
        <div className="pills-bar-fade pills-bar-fade--right" aria-hidden="true" />
      </div>
    </nav>
  )
}
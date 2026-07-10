import { useRef, useState } from 'react'

const MAX_TILT = 14

export default function PhoneMockup() {
  const stageRef = useRef(null)
  const dragging = useRef(false)
  const lastPoint = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const applyRotation = () => {
    const stage = stageRef.current
    if (!stage) return

    const { x, y } = rotation.current
    stage.style.setProperty('--tilt-x', `${x}deg`)
    stage.style.setProperty('--tilt-y', `${y}deg`)
  }

  const handlePointerDown = (event) => {
    dragging.current = true
    setIsDragging(true)
    lastPoint.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragging.current) return

    const deltaX = event.clientX - lastPoint.current.x
    const deltaY = event.clientY - lastPoint.current.y
    lastPoint.current = { x: event.clientX, y: event.clientY }

    rotation.current = {
      x: Math.max(-MAX_TILT, Math.min(MAX_TILT, rotation.current.x - deltaY * 0.18)),
      y: Math.max(-MAX_TILT, Math.min(MAX_TILT, rotation.current.y + deltaX * 0.18)),
    }

    applyRotation()
  }

  const endDrag = (event) => {
    if (!dragging.current) return

    dragging.current = false
    setIsDragging(false)

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleHoverMove = (event) => {
    if (dragging.current) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    rotation.current = {
      x: -y * 6,
      y: x * 6,
    }
    applyRotation()
  }

  const handleLeave = () => {
    if (dragging.current) return

    rotation.current = { x: 0, y: 0 }
    applyRotation()
  }

  return (
    <div className="wedding-card-window">
      <div className="wedding-card-window-bar">
        <span>Drag to explore</span>
        <span>✿</span>
      </div>
      <div
        ref={stageRef}
        className={`wedding-card-preview-stage${isDragging ? ' wedding-card-preview-stage--dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseMove={handleHoverMove}
        onMouseLeave={handleLeave}
      >
        <div className="wedding-card-preview-inner">
          <img
            src="/hero-e-invite-mockup.png"
            alt="Digital wedding e-invitation preview on a phone"
            className="wedding-card-preview-image"
            loading="eager"
            draggable={false}
          />
        </div>
      </div>
    </div>
  )
}

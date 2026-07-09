export default function FloralAccent({ className = '', opacity = 0.12 }) {
  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      style={{ opacity }}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 15 C55 25, 45 30, 40 40 C35 50, 38 60, 45 65 C52 70, 60 68, 65 62 C70 56, 72 48, 68 40 C64 32, 60 25, 60 15Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M60 68 L60 95 M52 85 C55 88, 65 88, 68 85"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="48" cy="38" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="72" cy="38" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  )
}

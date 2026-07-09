import { useEffect } from 'react'

function FloatingFlower({ style, delay }) {
  return (
    <svg
      className="absolute text-white"
      style={{
        ...style,
        animation: `float-flower 4s ease-in-out ${delay}s infinite`,
      }}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6 C18 10, 14 12, 12 16 C10 20, 12 24, 16 26 C20 28, 24 26, 26 22 C28 18, 26 14, 22 12 C20 10, 20 8, 20 6Z"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path d="M20 26 L20 34" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

export default function Loader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #FDF6F0 0%, #F3D9DF 40%, #C4506B 100%)',
        animation: 'loader-fade-out 0.6s ease 1.6s forwards',
      }}
    >
      <FloatingFlower style={{ top: '20%', left: '15%' }} delay={0} />
      <FloatingFlower style={{ top: '30%', right: '20%' }} delay={0.8} />
      <FloatingFlower style={{ bottom: '25%', left: '25%' }} delay={1.2} />
      <FloatingFlower style={{ bottom: '30%', right: '15%' }} delay={0.4} />
      <FloatingFlower style={{ top: '45%', left: '8%' }} delay={1.6} />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <img
          src="/logo.png"
          alt="The Paper Story"
          className="h-28 w-28 rounded-full shadow-lg sm:h-36 sm:w-36"
          style={{ animation: 'gentle-pulse 2s ease-in-out infinite' }}
        />
        <p className="font-serif text-lg tracking-wide text-paperstory-maroon-deep sm:text-xl">
          the paper story
        </p>
      </div>
    </div>
  )
}

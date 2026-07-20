import { useEffect } from 'react'

export default function Loader({ onComplete, quick = false }) {
  const duration = quick ? 1100 : 2400
  const fadeStart = quick ? '0.55s' : '1.8s'
  const fadeDuration = quick ? '0.45s' : '0.7s'

  useEffect(() => {
    const timer = setTimeout(onComplete, duration)
    return () => clearTimeout(timer)
  }, [onComplete, duration])

  return (
    <div
      className="loader-screen fixed inset-0 z-[100] flex items-center justify-center"
      style={{ animation: `loader-fade-out ${fadeDuration} ease ${fadeStart} forwards` }}
    >
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="loader-logo-wrap">
          <img
            src="/logo-white.png"
            alt="The Paper Story"
            className="h-52 w-auto max-w-[min(92vw,32rem)] object-contain sm:h-64 md:h-72 lg:h-80"
          />
        </div>
        <div className="loader-dots flex gap-2.5">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

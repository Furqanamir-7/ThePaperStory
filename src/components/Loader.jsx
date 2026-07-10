import { useEffect } from 'react'
import BrandWordmark from './BrandWordmark'
import FloralScatter from './FloralScatter'

const loaderFlowers = [
  { id: 1, className: 'loader-floral--1', rotate: '-12deg', drift: true },
  { id: 2, className: 'loader-floral--2', rotate: '18deg', drift: true, reverse: true },
  { id: 3, className: 'loader-floral--3', rotate: '8deg' },
  { id: 4, className: 'loader-floral--4', rotate: '-20deg', drift: true },
  { id: 5, className: 'loader-floral--5', rotate: '24deg' },
  { id: 6, className: 'loader-floral--6', rotate: '-6deg', drift: true, reverse: true },
  { id: 7, className: 'loader-floral--7', rotate: '14deg' },
  { id: 8, className: 'loader-floral--8', rotate: '-16deg', drift: true },
  { id: 9, className: 'loader-floral--9', rotate: '10deg' },
  { id: 10, className: 'loader-floral--10', rotate: '-8deg', drift: true, reverse: true },
  { id: 11, className: 'loader-floral--11', rotate: '16deg' },
  { id: 12, className: 'loader-floral--12', rotate: '-18deg', drift: true },
  { id: 13, className: 'loader-floral--13', rotate: '6deg', drift: true, reverse: true },
  { id: 14, className: 'loader-floral--14', rotate: '-10deg' },
  { id: 15, className: 'loader-floral--15', rotate: '22deg', drift: true },
  { id: 16, className: 'loader-floral--16', rotate: '-14deg' },
  { id: 17, className: 'loader-floral--17', rotate: '12deg', drift: true, reverse: true },
  { id: 18, className: 'loader-floral--18', rotate: '-8deg' },
]

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
      <FloralScatter flowers={loaderFlowers} className="loader-floral-bg" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="loader-logo-wrap flex items-center gap-4 sm:gap-5">
          <img
            src="/logo.png"
            alt="The Paper Story"
            className="h-20 w-20 rounded-full shadow-lg ring-4 ring-white/80 sm:h-24 sm:w-24"
          />
          <BrandWordmark size="lg" variant="dark" />
        </div>
        <div className="loader-dots flex gap-2">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

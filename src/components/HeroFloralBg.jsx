import FloralScatter from './FloralScatter'

const heroFlowers = [
  { id: 1, className: 'hero-floral--1', rotate: '-12deg', drift: true },
  { id: 2, className: 'hero-floral--2', rotate: '18deg', drift: true, reverse: true },
  { id: 3, className: 'hero-floral--3', rotate: '8deg' },
  { id: 4, className: 'hero-floral--4', rotate: '-20deg', drift: true },
  { id: 5, className: 'hero-floral--5', rotate: '24deg' },
  { id: 6, className: 'hero-floral--6', rotate: '-6deg', drift: true, reverse: true },
  { id: 7, className: 'hero-floral--7', rotate: '14deg' },
  { id: 8, className: 'hero-floral--8', rotate: '-16deg' },
  { id: 9, className: 'hero-floral--9', rotate: '10deg', drift: true },
  { id: 10, className: 'hero-floral--10', rotate: '-8deg' },
  { id: 11, className: 'hero-floral--11', rotate: '16deg', drift: true },
  { id: 12, className: 'hero-floral--12', rotate: '-18deg' },
  { id: 13, className: 'hero-floral--13', rotate: '6deg', drift: true, reverse: true },
  { id: 14, className: 'hero-floral--14', rotate: '-10deg' },
  { id: 15, className: 'hero-floral--15', rotate: '22deg' },
  { id: 16, className: 'hero-floral--16', rotate: '-14deg', drift: true },
  { id: 17, className: 'hero-floral--17', rotate: '12deg' },
  { id: 18, className: 'hero-floral--18', rotate: '-8deg', drift: true, reverse: true },
]

export default function HeroFloralBg() {
  return <FloralScatter flowers={heroFlowers} className="hero-floral-bg" />
}

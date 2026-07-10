import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import BrandWordmark from './BrandWordmark'
import MobileMenu from './MobileMenu'

const mainLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold tracking-wide transition-colors hover:text-white sm:text-base ${
      isActive ? 'text-white' : 'text-paperstory-cream/90'
    }`

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 bg-paperstory-maroon shadow-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-4">
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="h-10 w-10 shrink-0 rounded-full sm:h-14 sm:w-14"
            />
            <BrandWordmark size="nav" variant="light" className="min-w-0 truncate" />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex xl:gap-9">
            {mainLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={link.to === '/shop'
                    ? ({ isActive }) => linkClass({ isActive: isActive || location.pathname.startsWith('/shop') })
                    : linkClass}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={`mobile-hamburger lg:hidden${menuOpen ? ' mobile-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="mobile-hamburger-line" />
            <span className="mobile-hamburger-line" />
            <span className="mobile-hamburger-line" />
          </button>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

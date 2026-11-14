import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import MobileMenu from './MobileMenu'
import BrandWordmark from './BrandWordmark'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { itemCount = 0 } = useCart()

  const linkClass = ({ isActive }) =>
    `font-sans text-sm font-semibold tracking-widest uppercase transition-colors hover:text-paperstory-gold ${
      isActive ? 'text-paperstory-gold' : 'text-paperstory-cream'
    }`

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 bg-paperstory-maroon shadow-md">
        <nav className="mx-auto flex max-w-[96rem] items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4 lg:pl-5 lg:pr-7 xl:pl-6 xl:pr-8">
          {/* Left section: Hamburger button on mobile & desktop + Logo (positioned neatly to the left) */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className={`flex items-center gap-2 rounded-full px-2 py-1.5 sm:px-2.5 sm:py-2 text-paperstory-cream transition-colors hover:bg-paperstory-cream/15 focus:outline-hidden cursor-pointer ${
                menuOpen ? 'bg-paperstory-cream/20' : ''
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className={`mobile-hamburger mobile-hamburger--nav${menuOpen ? ' mobile-hamburger--open' : ''}`}>
                <span className="mobile-hamburger-line" />
                <span className="mobile-hamburger-line" />
                <span className="mobile-hamburger-line" />
              </div>
              <span className="hidden font-sans text-xs font-semibold tracking-widest uppercase sm:inline text-paperstory-cream/90">
                Menu
              </span>
            </button>

            <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <img
                src="/logo.png"
                alt=""
                aria-hidden="true"
                className="h-10 w-10 shrink-0 rounded-full sm:h-13 sm:w-13"
              />
              <BrandWordmark size="nav" variant="light" className="min-w-0 truncate" />
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <ul className="hidden items-center gap-6 xl:gap-8 lg:flex">
            <li>
              <NavLink to="/" end className={linkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={linkClass}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" className={linkClass}>
                Shop all
              </NavLink>
            </li>

            <li>
              <NavLink to="/shipping" className={linkClass}>
                Shipping
              </NavLink>
            </li>

            <li>
              <NavLink to="/contact" className={linkClass}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Right section: Cart link */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/cart"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paperstory-cream/15 text-paperstory-cream transition-colors hover:bg-paperstory-cream/25 lg:h-11 lg:w-11"
              aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" />
                <path d="M6 6 5 3H2" strokeLinecap="round" />
                <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              {itemCount > 0 && (
                <span className="cart-nav-badge">{itemCount > 99 ? '99+' : itemCount}</span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Drawer slides out from left side */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} itemCount={itemCount} />
    </>
  )
}

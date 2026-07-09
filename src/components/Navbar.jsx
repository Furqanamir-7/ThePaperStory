import { useEffect, useState } from 'react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#shop' },
  { label: 'Wedding Invitations', href: '#categories' },
  { label: 'E-Invites', href: '#categories' },
  { label: 'Custom Printing', href: '#about' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-paperstory-cream/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#home" className="flex shrink-0 items-center gap-2">
          <img
            src="/logo.png"
            alt="The Paper Story"
            className="h-11 w-11 rounded-full sm:h-12 sm:w-12"
          />
        </a>

        <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`text-xs font-medium tracking-wide transition-colors hover:text-paperstory-maroon xl:text-sm ${
                  scrolled ? 'text-gray-700' : 'text-white/95'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className={`hidden rounded-full p-2 transition-colors hover:bg-paperstory-blush/50 sm:block ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Cart"
            className={`rounded-full p-2 transition-colors hover:bg-paperstory-blush/50 ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            className={`rounded-lg p-2 lg:hidden ${scrolled || menuOpen ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 top-[60px] z-40 bg-paperstory-cream lg:hidden">
          <ul className="flex flex-col gap-1 px-6 py-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-paperstory-blush/60 hover:text-paperstory-maroon"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

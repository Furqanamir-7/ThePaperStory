import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandWordmark from './BrandWordmark'
import { shopCategories } from '../data/products'

const mainLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Shop all', to: '/shop' },
  { label: 'Contact', to: '/contact' },
]

export default function MobileMenu({ open, onClose }) {
  const [active, setActive] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setActive(true))
      })
      return () => cancelAnimationFrame(frame)
    }

    setActive(false)
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) {
      const timer = window.setTimeout(() => setActiveCategory(null), 320)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [open])

  const handleTransitionEnd = () => {
    if (!open) {
      setMounted(false)
      setActiveCategory(null)
    }
  }

  if (!mounted) return null

  const showSub = Boolean(activeCategory)

  return (
    <div className={`mobile-menu-root${active ? ' mobile-menu-root--open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="mobile-menu-overlay"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div
        className={`mobile-menu-drawer${active ? ' mobile-menu-drawer--open' : ''}`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="mobile-menu-header">
          <button type="button" className="mobile-menu-icon-btn" onClick={onClose} aria-label="Close menu">
            <span className="mobile-menu-close" aria-hidden="true" />
          </button>
          <Link to="/" className="mobile-menu-brand" onClick={onClose}>
            <img src="/logo.png" alt="" className="h-9 w-9 rounded-full" aria-hidden="true" />
            <BrandWordmark size="sm" variant="dark" />
          </Link>
          <div className="mobile-menu-icon-btn mobile-menu-icon-btn--spacer" aria-hidden="true" />
        </div>

        {showSub && (
          <div className="mobile-menu-subbar">
            <button
              type="button"
              className="mobile-menu-back"
              onClick={() => setActiveCategory(null)}
            >
              <span className="mobile-menu-back-arrow" aria-hidden="true" />
              {activeCategory.label}
            </button>
          </div>
        )}

        <div className="mobile-menu-body">
          <div className={`mobile-menu-panels${showSub ? ' mobile-menu-panels--sub' : ''}`}>
            <div className="mobile-menu-panel">
              <ul className="mobile-menu-list">
                {mainLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="mobile-menu-link" onClick={onClose}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mobile-menu-section-label">Categories</p>
              <ul className="mobile-menu-list">
                {shopCategories.map((cat) => (
                  <li key={cat.id}>
                    {cat.subcategories?.length ? (
                      <button
                        type="button"
                        className="mobile-menu-link mobile-menu-link--button"
                        onClick={() => setActiveCategory(cat)}
                      >
                        <span>{cat.label}</span>
                        <span className="mobile-menu-arrow" aria-hidden="true">→</span>
                      </button>
                    ) : (
                      <Link
                        to={`/shop/${cat.slug}`}
                        className="mobile-menu-link"
                        onClick={onClose}
                      >
                        <span>{cat.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mobile-menu-panel">
              {activeCategory && (
                <ul className="mobile-menu-list">
                  <li>
                    <Link
                      to={`/shop/${activeCategory.slug}`}
                      className="mobile-menu-link mobile-menu-link--emphasis"
                      onClick={onClose}
                    >
                      View all {activeCategory.shortLabel}
                    </Link>
                  </li>
                  {activeCategory.subcategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        to={`/shop/${activeCategory.slug}/${sub.slug}`}
                        className="mobile-menu-link"
                        onClick={onClose}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

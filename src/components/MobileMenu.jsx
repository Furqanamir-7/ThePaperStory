import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandWordmark from './BrandWordmark'
import { shopCategories, products } from '../data/products'

const mainLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Shop all', to: '/shop' },
  { label: 'Worldwide Shipping', to: '/shipping' },
  { label: 'Cart', to: '/cart', badge: true },
  { label: 'Contact', to: '/contact' },
]

export default function MobileMenu({ open, onClose, itemCount = 0 }) {
  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((p) => {
        const name = (p.name || '').toLowerCase()
        const code = (p.code || p.sku || '').toLowerCase()
        const cat = (p.category || '').toLowerCase()
        return name.includes(q) || code.includes(q) || cat.includes(q)
      })
      .slice(0, 12)
  }, [searchQuery])

  useEffect(() => {
    if (open) {
      setMounted(true)
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setActive(true))
      })
      return () => cancelAnimationFrame(frame)
    }

    setActive(false)
    setSearchQuery('')
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
      setSearchQuery('')
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

        {/* Search Bar at the Top */}
        <div className="px-4 py-2.5 border-b border-paperstory-maroon/10 bg-white/50">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (searchResults.length > 0) {
                navigate(`/product/${searchResults[0].code || searchResults[0].sku}`)
                onClose()
              } else if (searchQuery.trim()) {
                navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
                onClose()
              }
            }}
            className="relative flex items-center"
          >
            <span className="absolute left-3 text-paperstory-maroon/60 text-xs pointer-events-none" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wedding cards, favours, seals..."
              className="w-full rounded-full bg-paperstory-wash/80 border border-paperstory-maroon/15 pl-8 pr-7 py-2 text-xs text-paperstory-ink placeholder:text-paperstory-ink/40 focus:outline-none focus:border-paperstory-maroon focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-paperstory-ink/50 hover:text-paperstory-ink text-xs p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {searchQuery.trim() ? (
          <div className="mobile-menu-body p-4 overflow-y-auto">
            <p className="text-[11px] font-semibold text-paperstory-maroon/70 uppercase tracking-wider mb-2">
              Results ({searchResults.length})
            </p>
            {searchResults.length === 0 ? (
              <div className="py-8 text-center text-xs text-paperstory-ink/60">
                No designs found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              <ul className="space-y-1.5">
                {searchResults.map((item) => (
                  <li key={item.id || item.code}>
                    <Link
                      to={`/product/${item.code || item.sku}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-paperstory-wash transition border border-transparent hover:border-paperstory-maroon/10"
                    >
                      <img
                        src={item.image || item.images?.[0] || '/wedding-invites/cover.jpg'}
                        alt={item.name}
                        className="w-10 h-12 object-cover rounded-md shrink-0 bg-white border border-paperstory-maroon/10"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-paperstory-ink truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-paperstory-ink/60 flex items-center gap-2">
                          <span className="truncate">{item.category}</span>
                          {item.code && (
                            <span className="font-mono text-paperstory-maroon/80 font-bold shrink-0">
                              {item.code}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-paperstory-maroon/60 text-xs shrink-0">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <>
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
                          <span>{link.label}</span>
                          {link.badge && itemCount > 0 && (
                            <span className="cart-nav-badge cart-nav-badge--menu">{itemCount > 99 ? '99+' : itemCount}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <p className="mobile-menu-section-label">Products</p>
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
                            to={sub.code ? `/product/${sub.code}` : `/shop/${activeCategory.slug}/${sub.slug}`}
                            className="mobile-menu-link flex items-center justify-between"
                            onClick={onClose}
                          >
                            <span>{sub.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

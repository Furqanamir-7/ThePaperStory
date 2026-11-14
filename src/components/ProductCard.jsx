import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  if (!product) return null

  const [addedFeedback, setAddedFeedback] = useState(false)
  const { addItem } = useCart()
  const navigate = useNavigate()

  const primaryImg = product.image || (product.images && product.images[0]) || '/wedding-invites/cover.jpg'
  const isVideo = typeof primaryImg === 'string' && /\.(mp4|webm|mov)(\?.*)?$/i.test(primaryImg)

  const handleQuickAdd = (e) => {
    e.stopPropagation()
    addItem(product, 1)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 1400)
  }

  const addToCartEnabled = Boolean(product.showPrice && product.price)

  const handleCardClick = () => {
    if (product.externalUrl) {
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer')
      return
    }
    const code = product.code || product.sku || product.id
    navigate(`/product/${encodeURIComponent(code)}`)
  }

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-paperstory-maroon/10 p-2 sm:p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-paperstory-maroon/25 cursor-pointer"
    >
      <div>
        {/* Media Container (4:5 Aspect Ratio) */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg sm:rounded-xl bg-paperstory-wash/50">
          {isVideo ? (
            <video
              src={primaryImg}
              poster="/wedding-invites/cover.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <img
              src={primaryImg}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/wedding-invites/cover.jpg'
              }}
            />
          )}

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-paperstory-maroon/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center p-2 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold tracking-wider text-paperstory-maroon uppercase shadow-md backdrop-blur-xs hover:bg-paperstory-maroon hover:text-white transition">
              View Design
            </span>
          </div>

          {/* Multi-photo badge for add-ons with gallery */}
          {product.imageCount > 1 && (
            <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2 py-1 shadow-sm border border-paperstory-maroon/15">
              <svg className="w-3 h-3 text-paperstory-maroon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 15l4-4a2 2 0 012.8 0L15 16" />
                <path d="M14 14l1-1a2 2 0 012.8 0L21 16" />
              </svg>
              <span className="text-[10px] font-semibold text-paperstory-maroon tabular-nums">
                {product.imageCount} Photos
              </span>
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="pt-2 sm:pt-3">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-paperstory-maroon/70 font-semibold truncate">
              {product.subcategorySlug === 'potli' ? 'POTLI FAVOURS' : (product.category || 'The Paper Story')}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {product.instagramUrl && (
                <span
                  title="Watch Reel on Instagram"
                  className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs"
                  style={{ background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' }}
                >
                  <span>📸</span>
                  <span>Reel</span>
                </span>
              )}
              {(product.code || product.sku) &&
                !String(product.code || product.sku).toUpperCase().startsWith('TPS-ACC') && (
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-paperstory-maroon bg-paperstory-wash px-1.5 py-0.5 rounded border border-paperstory-maroon/15">
                    {product.code || product.sku}
                  </span>
              )}
            </div>
          </div>

          <h3 className="font-serif text-xs sm:text-sm md:text-base font-medium text-paperstory-charcoal leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-paperstory-maroon transition-colors">
            {product.name}
          </h3>

          {product.badge && (
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-400 shadow-xs tracking-wide">
                {product.badge}
              </span>
            </div>
          )}

          {product.showPrice && product.price ? (
            <p className="mt-1 font-sans text-xs sm:text-sm font-semibold text-paperstory-maroon">
              {product.price}
            </p>
          ) : (
            <p className="mt-1 font-sans text-[11px] sm:text-xs text-paperstory-charcoal/60 italic">
              Price on Request
            </p>
          )}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="mt-2.5 sm:mt-3 pt-2 border-t border-paperstory-maroon/5">
        {addToCartEnabled ? (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full rounded-full border border-paperstory-maroon/30 bg-paperstory-wash/80 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-paperstory-maroon transition-all duration-200 hover:border-paperstory-maroon hover:bg-paperstory-maroon hover:text-white active:scale-98 cursor-pointer"
          >
            {addedFeedback ? 'Added ✓' : 'Add to Cart'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCardClick}
            className="block w-full rounded-full border border-paperstory-maroon/20 bg-paperstory-wash/60 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-paperstory-maroon transition-all duration-200 hover:border-paperstory-maroon hover:bg-paperstory-maroon hover:text-white cursor-pointer"
          >
            {product.imageCount > 1 ? 'View All Photos' : 'View Design'}
          </button>
        )}
      </div>
    </article>
  )
}

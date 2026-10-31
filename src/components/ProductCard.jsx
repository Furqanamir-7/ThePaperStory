import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import QuickViewModal from './QuickViewModal'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, inFeaturedCollection = false }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const { addItem } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const primaryImg = product.image || (product.images && product.images[0]) || '/wedding-invites/cover.jpg'
  const isVideo = typeof primaryImg === 'string' && /\.(mp4|webm|mov)(\?.*)?$/i.test(primaryImg)

  const isWeddingInvite = product.categorySlug === 'wedding-invitations'
  const isFeaturedWedding = isWeddingInvite && (inFeaturedCollection || location.pathname === '/' || location.pathname === '/shop')

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
    // In featured collections, if a person presses wedding invitations, automatically open all the collection for that product
    if (isFeaturedWedding) {
      navigate('/shop/wedding-invitations')
      return
    }
    setQuickViewOpen(true)
  }

  return (
    <>
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
                {isFeaturedWedding ? 'Open Collection (48 Designs) →' : 'Quick View'}
              </span>
            </div>
          </div>

          {/* Product Meta */}
          <div className="pt-2 sm:pt-3">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-paperstory-maroon/70 font-semibold truncate">
                {product.category || 'The Paper Story'}
              </span>
              {product.code && (
                <span className="shrink-0 font-mono text-[9px] sm:text-[10px] font-bold text-paperstory-maroon bg-paperstory-wash px-1.5 py-0.5 rounded border border-paperstory-maroon/15">
                  {product.code}
                </span>
              )}
            </div>

            <h3 className="font-serif text-xs sm:text-sm md:text-base font-medium text-paperstory-charcoal leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-paperstory-maroon transition-colors">
              {product.name}
            </h3>

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
          ) : isFeaturedWedding ? (
            <span className="block w-full rounded-full border border-paperstory-maroon bg-paperstory-maroon py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 shadow-xs hover:opacity-95">
              Open All 48 Designs →
            </span>
          ) : (
            <span className="block w-full rounded-full border border-paperstory-maroon/20 bg-paperstory-wash/60 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-paperstory-maroon transition-all duration-200 group-hover:border-paperstory-maroon group-hover:bg-paperstory-maroon group-hover:text-white">
              View Details
            </span>
          )}
        </div>
      </article>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  )
}

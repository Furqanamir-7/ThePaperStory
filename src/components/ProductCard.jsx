import { useState } from 'react'
import { canAddToCart, canPlaceOrder } from '../data/site'
import { useCart } from '../context/CartContext'
import OrderModal from './OrderModal'
import InquiryModal from './InquiryModal'
import QuickViewModal from './QuickViewModal'

function isVideoSrc(src = '') {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src)
}

export default function ProductCard({ product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)

  const { addItem } = useCart()
  const gallery = product.images?.length ? product.images : [product.image]
  const primaryImg = gallery[0] || product.image
  const secondaryImg = gallery[1] || null
  const hasSecondary = Boolean(secondaryImg && !isVideoSrc(primaryImg) && !isVideoSrc(secondaryImg))
  const isVideo = isVideoSrc(primaryImg)

  const showPrice = product.showPrice && product.price
  const addToCartEnabled = canAddToCart(product)

  const formattedPrice = showPrice
    ? (product.price.startsWith('PKR') || product.price.startsWith('Rs')
        ? product.price
        : `Rs. ${product.price}`)
    : 'Price on request'

  const handleQuickAdd = (e) => {
    e.stopPropagation()
    addItem(product, 1)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  const handleCardClick = () => {
    if (product.externalUrl) {
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer')
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
          {/* Media Container (4:5 Aspect Ratio like pocketsofbeige) */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg sm:rounded-xl bg-paperstory-wash/50">
            {isVideo ? (
              <video
                src={primaryImg}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover object-center"
                aria-label={product.name}
              />
            ) : (
              <>
                {/* Primary Image */}
                <img
                  src={primaryImg}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
                    hasSecondary ? 'group-hover:opacity-0' : ''
                  }`}
                />

                {/* Secondary Image on Hover (pocketsofbeige signature hover) */}
                {hasSecondary && (
                  <img
                    src={secondaryImg}
                    alt={`${product.name} alternate angle`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                  />
                )}
              </>
            )}

            {/* Badge (Top-Left) */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {product.categorySlug === 'wedding-invitations' && (
                <span className="rounded-full bg-white/95 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[11px] font-medium tracking-wide text-paperstory-maroon shadow-xs border border-paperstory-maroon/15 backdrop-blur-xs">
                  Wedding Suite
                </span>
              )}
              {product.isBestSeller && (
                <span className="rounded-full bg-paperstory-blush/95 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[11px] font-semibold tracking-wide text-paperstory-maroon shadow-xs border border-paperstory-maroon/20">
                  Best Seller
                </span>
              )}
            </div>

            {/* Multiple Images Indicator (Mobile / Tablet) */}
            {gallery.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 sm:hidden">
                <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white tabular-nums backdrop-blur-xs">
                  1/{gallery.length}
                </span>
              </div>
            )}

            {/* Desktop Hover Quick View Overlay Pill */}
            <div className="absolute inset-x-0 bottom-3 z-10 hidden sm:flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold tracking-wider text-paperstory-maroon uppercase shadow-md backdrop-blur-xs hover:bg-paperstory-maroon hover:text-white transition">
                Quick View
              </span>
            </div>
          </div>

          {/* Card Content Below Media */}
          <div className="mt-2.5 sm:mt-3 text-left">
            {/* Vendor / Brand Subtitle */}
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-paperstory-maroon/70 font-semibold mb-1 truncate">
              {product.category || 'The Paper Story'}
            </div>

            {/* Product Title (Consistent 2-line height for uniform baseline) */}
            <h3 className="font-serif text-xs sm:text-sm md:text-base font-normal sm:font-medium text-paperstory-ink leading-snug line-clamp-2 h-[2.25rem] sm:h-[2.6rem] flex items-start transition-colors group-hover:text-paperstory-maroon">
              {product.name}
            </h3>

            {/* Price (Pocket of Beige Style) */}
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xs sm:text-sm font-sans font-semibold text-paperstory-maroon">
                {formattedPrice}
              </span>
              {showPrice && (
                <span className="text-[10px] sm:text-xs font-sans text-paperstory-ink/60">PKR</span>
              )}
            </div>

            {/* Price Note (if present) or empty spacer to keep rows aligned */}
            <p className="mt-0.5 text-[10px] sm:text-xs font-medium text-paperstory-maroon/75 truncate min-h-[1rem]">
              {product.priceNote || ''}
            </p>
          </div>
        </div>

        {/* Bottom Action Button (Clean, Uniform Pill across all cards in the grid) */}
        <div className="mt-2 sm:mt-3 pt-1">
          {addToCartEnabled ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full rounded-full border border-paperstory-maroon/30 bg-paperstory-wash/80 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-paperstory-maroon transition-all duration-200 hover:border-paperstory-maroon hover:bg-paperstory-maroon hover:text-white active:scale-98 cursor-pointer"
            >
              {addedFeedback ? 'Added ✓' : 'Add to Cart'}
            </button>
          ) : (
            <span className="block w-full rounded-full border border-paperstory-maroon/20 bg-paperstory-wash/60 py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-paperstory-maroon transition-all duration-200 group-hover:border-paperstory-maroon group-hover:bg-paperstory-maroon group-hover:text-white">
              View Details
            </span>
          )}
        </div>
      </article>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
          onOpenOrder={() => setOrderOpen(true)}
          onOpenInquiry={() => setInquiryOpen(true)}
        />
      )}

      {/* Place Order Modal */}
      {orderOpen && (
        <OrderModal product={product} onClose={() => setOrderOpen(false)} />
      )}

      {/* Custom Inquiry Modal */}
      {inquiryOpen && (
        <InquiryModal product={product} onClose={() => setInquiryOpen(false)} />
      )}
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp'
import { canAddToCart, canPlaceOrder } from '../data/site'
import { useCart } from '../context/CartContext'

function isVideoSrc(src = '') {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src)
}

export default function QuickViewModal({
  product,
  initialIndex = 0,
  onClose,
  onOpenOrder,
  onOpenInquiry,
}) {
  const [index, setIndex] = useState(initialIndex)
  const [quantity, setQuantity] = useState(1)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const { addItem } = useCart()

  const gallery = product?.images?.length ? product.images : [product?.image]
  const current = gallery[index] || product?.image
  const isVideo = isVideoSrc(current)
  const hasGallery = gallery.length > 1
  const externalUrl = product?.externalUrl

  const whatsappUrl = buildWhatsAppUrl(buildProductWhatsAppMessage(product))
  const showPrice = product?.showPrice && product?.price
  const isCod = product?.paymentType === 'cod'
  const orderable = canPlaceOrder(product)
  const addToCartEnabled = canAddToCart(product)
  const orderOnline = Boolean(product?.orderOnline)

  // Touch swipe support
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)

  const goTo = (next) => setIndex((next + gallery.length) % gallery.length)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft' && hasGallery) goTo(index - 1)
      if (e.key === 'ArrowRight' && hasGallery) goTo(index + 1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [hasGallery, index, onClose])

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!hasGallery) return
    const diff = touchStartXRef.current - touchEndXRef.current
    if (diff > 45) {
      goTo(index + 1)
    } else if (diff < -45) {
      goTo(index - 1)
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2200)
  }

  const priceFormatted = showPrice
    ? (product.price.startsWith('PKR') || product.price.startsWith('Rs')
        ? product.price
        : `Rs. ${product.price}`)
    : 'Price on request'

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-paperstory-maroon/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-paperstory-ink shadow-md transition hover:bg-paperstory-maroon hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Media Gallery */}
          <div className="flex flex-col bg-paperstory-wash/50 p-3 sm:p-6 border-b md:border-b-0 md:border-r border-paperstory-maroon/10">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-white shadow-inner flex items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isVideo ? (
                <video
                  src={current}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <img
                  src={current}
                  alt={product.name}
                  className="h-full w-full object-cover object-center transition-all duration-300"
                />
              )}

              {/* Gallery Navigation Arrows */}
              {hasGallery && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-paperstory-maroon shadow-md hover:bg-paperstory-maroon hover:text-white transition cursor-pointer"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-paperstory-maroon shadow-md hover:bg-paperstory-maroon hover:text-white transition cursor-pointer"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Counter badge */}
              {hasGallery && (
                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/55 px-2.5 py-0.5 text-[11px] font-medium text-white tracking-wider tabular-nums backdrop-blur-xs">
                  {index + 1} / {gallery.length}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasGallery && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                {gallery.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`relative h-14 w-12 shrink-0 overflow-hidden rounded-md border-2 transition cursor-pointer ${
                      i === index
                        ? 'border-paperstory-maroon ring-1 ring-paperstory-maroon'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    {isVideoSrc(img) ? (
                      <div className="h-full w-full bg-paperstory-pale flex items-center justify-center text-[10px] text-paperstory-maroon font-bold">
                        ▶
                      </div>
                    ) : (
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="flex flex-col justify-between p-4 sm:p-6 md:p-8 pb-8 sm:pb-8 bg-white">
            <div>
              {/* Brand Tag & Category */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-sans uppercase tracking-widest text-paperstory-maroon/70 font-semibold">
                  The Paper Story
                </span>
                <span className="text-paperstory-maroon/30">·</span>
                <span className="rounded-full bg-paperstory-blush/80 px-2.5 py-0.5 text-[11px] font-medium text-paperstory-maroon">
                  {product.category || 'Luxury Stationery'}
                </span>
              </div>

              {/* Product Title */}
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-paperstory-ink leading-tight mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-lg sm:text-2xl font-serif font-bold text-paperstory-maroon">
                  {priceFormatted}
                </span>
                {showPrice && <span className="text-xs font-sans text-paperstory-ink/60">PKR</span>}
                {product.priceNote && (
                  <span className="text-xs font-medium text-paperstory-maroon/80">
                    ({product.priceNote})
                  </span>
                )}
              </div>

              {/* Description / Highlights */}
              <div className="mb-4 space-y-2 text-xs sm:text-sm text-readable-muted border-t border-b border-paperstory-maroon/10 py-3">
                <p>
                  Handcrafted with fine textured cardstock, bespoke foil accents, and artisanal detailing.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-paperstory-wash px-2 py-1 text-[11px] text-paperstory-maroon font-medium">
                    ✓ {orderOnline ? 'Order online with card' : isCod ? 'Cash on Delivery (Pakistan)' : 'Advance payment'}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-paperstory-wash px-2 py-1 text-[11px] text-paperstory-maroon font-medium">
                    ✓ Custom suite & inserts available
                  </span>
                </div>
              </div>

              {/* Quantity selector (for cart-enabled items) */}
              {addToCartEnabled && (
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs font-medium text-paperstory-ink uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="flex items-center rounded-lg border border-paperstory-maroon/25 bg-paperstory-wash">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-sm font-semibold text-paperstory-maroon hover:bg-paperstory-blush rounded-l-lg transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-paperstory-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-sm font-semibold text-paperstory-maroon hover:bg-paperstory-blush rounded-r-lg transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2.5">
              {addedFeedback && (
                <div className="rounded-lg bg-paperstory-wash p-2 text-center text-xs font-semibold text-paperstory-maroon border border-paperstory-maroon/20 animate-in fade-in">
                  Added to cart ✓
                </div>
              )}

              {addToCartEnabled && (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="cute-btn-secondary w-full py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Add to Cart
                </button>
              )}

              {orderable && (
                <button
                  type="button"
                  onClick={() => {
                    onClose?.()
                    onOpenOrder?.(product)
                  }}
                  className="cute-btn-primary w-full py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {addToCartEnabled ? 'Buy Now' : 'Place Order'}
                </button>
              )}

              {!orderable && (
                <button
                  type="button"
                  onClick={() => {
                    onClose?.()
                    onOpenInquiry?.(product)
                  }}
                  className="cute-btn-primary w-full py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Request Custom Order / Inquiry
                </button>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-btn inline-flex min-h-[42px] w-full items-center justify-center rounded-full px-5 py-2.5 text-center text-xs sm:text-sm font-semibold tracking-wider text-white uppercase shadow-sm transition hover:opacity-95"
              >
                Inquire on WhatsApp
              </a>

              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-xs font-medium text-paperstory-maroon underline underline-offset-2 pt-1 hover:text-paperstory-maroon-deep"
                >
                  Open live wedding website preview ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

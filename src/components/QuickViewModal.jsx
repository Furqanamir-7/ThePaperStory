import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { buildWhatsAppUrl, buildProductWhatsAppMessage } from '../utils/whatsapp'
import ProductMediaGallery from './ProductMediaGallery'
import {
  getProductCode,
  getProductDescription,
  getProductWhatsIncluded,
  getProductSeoKeywords,
} from '../data/product-metadata'

export default function QuickViewModal({ product, onClose }) {
  if (!product) return null

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const productCode = product?.code || getProductCode(product)
  const productDescription = product?.description || getProductDescription(product)
  const whatsIncluded = product?.whatsIncluded || getProductWhatsIncluded(product)
  const seoKeywords = product?.seoKeywords || getProductSeoKeywords(product)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image || '/wedding-invites/cover.jpg']

  const handleAddToCart = () => {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const waProduct = { ...product, code: productCode }
  const whatsappUrl = buildWhatsAppUrl(buildProductWhatsAppMessage(waProduct))

  const collectionSlug = product.categorySlug || 'wedding-invitations'
  const isWeddingInvite = collectionSlug === 'wedding-invitations'

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-paperstory-charcoal/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-paperstory-maroon/10 p-4 sm:p-6 lg:p-8 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paperstory-wash text-paperstory-charcoal hover:bg-paperstory-maroon hover:text-white transition cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Swipeable & Zoomable Media Column */}
          <ProductMediaGallery
            images={images}
            selectedIndex={selectedImageIndex}
            onSelectIndex={setSelectedImageIndex}
            alt={product.name}
          />

          {/* Details Column */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Design Code Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-paperstory-blush/80 px-2.5 py-0.5 text-[11px] font-medium text-paperstory-maroon">
                  {product.category || 'Luxury Stationery'}
                </span>
                {productCode && (
                  <span className="rounded-full bg-paperstory-maroon/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-paperstory-maroon border border-paperstory-maroon/20">
                    {productCode}
                  </span>
                )}
                {product.type && (
                  <span className="rounded-full bg-paperstory-wash px-2.5 py-0.5 text-[11px] text-paperstory-charcoal/70">
                    {product.type}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-paperstory-charcoal leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                {product.showPrice && product.price ? (
                  <span className="font-sans text-xl sm:text-2xl font-bold text-paperstory-maroon">
                    {product.price}
                  </span>
                ) : (
                  <span className="font-sans text-sm sm:text-base text-paperstory-charcoal/70 italic">
                    Price available on inquiry (Custom orders vary by quantity)
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-paperstory-maroon/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-paperstory-maroon mb-1.5">
                  About This Design
                </h4>
                <p className="font-sans text-xs sm:text-sm text-paperstory-charcoal/80 leading-relaxed">
                  {productDescription}
                </p>
              </div>

              {/* What's Included */}
              {whatsIncluded && whatsIncluded.length > 0 && (
                <div className="mt-4 pt-3 border-t border-paperstory-maroon/10">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-paperstory-maroon mb-2 flex items-center gap-1.5">
                    <span>What's Included in This Suite</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {whatsIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-paperstory-charcoal/85">
                        <span className="text-paperstory-gold font-bold text-xs mt-0.5">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SEO / Style Tags */}
              {seoKeywords && seoKeywords.length > 0 && (
                <div className="mt-4 pt-3 border-t border-paperstory-maroon/10">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-paperstory-charcoal/60 mb-2">
                    Design & Style Tags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {seoKeywords.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-paperstory-wash px-2 py-0.5 text-[10px] sm:text-[11px] text-paperstory-charcoal/75 border border-paperstory-maroon/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-paperstory-maroon/10 flex flex-col gap-2.5">
              {product.showPrice && product.price ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full rounded-full bg-paperstory-maroon py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-widest text-white shadow-md transition hover:bg-paperstory-maroon/90 active:scale-98 cursor-pointer"
                >
                  {added ? 'Added to Cart ✓' : 'Add to Cart'}
                </button>
              ) : null}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-paperstory-maroon bg-white py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-paperstory-maroon transition hover:bg-paperstory-maroon hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Inquire on WhatsApp {productCode ? `(${productCode})` : ''}</span>
              </a>

              <Link
                to={`/shop/${collectionSlug}`}
                onClick={onClose}
                className="text-center font-sans text-xs text-paperstory-maroon font-semibold underline underline-offset-4 hover:opacity-80 py-1"
              >
                View Full {product.category || 'Collection'} ({isWeddingInvite ? '48 Designs' : 'All Designs'}) →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

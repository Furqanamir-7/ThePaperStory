import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAdminData } from '../admin/AdminDataContext'
import { buildWhatsAppUrl, buildProductWhatsAppMessage, getProductDirectUrl } from '../utils/whatsapp'
import ProductMediaGallery from './ProductMediaGallery'
import FormattedDescription from './FormattedDescription'
import {
  getProductCode,
  getProductDescription,
  getProductWhatsIncluded,
  getProductSeoKeywords,
} from '../data/product-metadata'

export default function QuickViewModal({ product, onClose }) {
  if (!product) return null

  let adminOverride = null
  try {
    const admin = useAdminData()
    if (admin && admin.products) {
      adminOverride = admin.products.find(
        (p) =>
          (p.id && String(p.id) === String(product.id)) ||
          (p.code && p.code.toLowerCase() === (product.code || '').toLowerCase()) ||
          (p.sku && p.sku.toLowerCase() === (product.code || product.sku || '').toLowerCase())
      )
    }
  } catch (e) {
    // Outside admin context
  }

  const activeProduct = adminOverride
    ? {
        ...product,
        ...adminOverride,
        code: product.code || adminOverride.code || adminOverride.sku,
        sku: product.sku || adminOverride.sku || adminOverride.code,
        categorySlug: product.categorySlug || adminOverride.categorySlug,
        designNumber: product.designNumber || adminOverride.designNumber,
      }
    : product

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [added, setAdded] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const { addItem } = useCart()

  const productCode = activeProduct?.code || activeProduct?.sku || getProductCode(activeProduct)
  const productDescription = activeProduct?.description || getProductDescription(activeProduct)
  const whatsIncluded = activeProduct?.whatsIncluded || getProductWhatsIncluded(activeProduct)
  const seoKeywords = activeProduct?.seoKeywords || getProductSeoKeywords(activeProduct)

  const rawInstagram = activeProduct?.instagramUrl || product?.instagramUrl
  const instagramUrl = rawInstagram
    ? rawInstagram.trim().startsWith('http')
      ? rawInstagram.trim()
      : `https://${rawInstagram.trim()}`
    : ''

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

  const images = (activeProduct.images && activeProduct.images.length > 0)
    ? activeProduct.images
    : [activeProduct.image || '/wedding-invites/cover.jpg']

  const handleAddToCart = () => {
    addItem(activeProduct, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const waProduct = { ...activeProduct, code: productCode }
  const whatsappUrl = buildWhatsAppUrl(buildProductWhatsAppMessage(waProduct))

  const collectionSlug = activeProduct.categorySlug || 'wedding-invitations'
  const isWeddingInvite = collectionSlug === 'wedding-invitations'
  const directUrl = getProductDirectUrl(waProduct)
  const productPath = `/product/${encodeURIComponent(productCode || activeProduct.sku || activeProduct.id)}`

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(directUrl).then(() => {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2200)
      })
    } else {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2200)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activeProduct.name} - The Paper Story`,
          text: `Check out this design from The Paper Story: ${activeProduct.name} [Code: ${productCode}]`,
          url: directUrl,
        })
      } catch (e) {
        // user closed
      }
    } else {
      handleCopyLink()
    }
  }

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

              {/* Minimum Order Quantity Notice */}
              <div className="mt-2.5 inline-flex items-center rounded-lg bg-paperstory-wash border border-paperstory-maroon/20 px-3 py-1 text-xs font-semibold text-paperstory-maroon">
                <span>Minimum Order Quantity: <strong>{activeProduct.minQuantity || 25} pieces</strong></span>
              </div>

              {/* Description */}
              {productDescription && (
                <div className="mt-4 pt-3 border-t border-paperstory-maroon/10">
                  <FormattedDescription content={productDescription} />
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

              {/* Instagram Reel Button */}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-full py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition hover:opacity-95 hover:shadow-md cursor-pointer"
                  style={{
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Watch Reel on Instagram</span>
                </a>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-paperstory-maroon hover:bg-paperstory-maroon-deep py-2.5 sm:py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition hover:shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Inquire on WhatsApp {productCode ? `(${productCode})` : ''}</span>
              </a>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  to={productPath}
                  onClick={onClose}
                  className="font-sans text-[11px] text-paperstory-maroon font-semibold underline underline-offset-4 hover:opacity-80"
                >
                  Open Dedicated Page ↗
                </Link>
                <Link
                  to={`/shop/${collectionSlug}`}
                  onClick={onClose}
                  className="font-sans text-[11px] text-paperstory-charcoal/70 hover:text-paperstory-maroon underline underline-offset-4"
                >
                  View Full {product.category || 'Collection'} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

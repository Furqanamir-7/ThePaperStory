import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { products, shopCategories } from '../data/products'
import { useStoreCatalog } from '../admin/AdminDataContext'
import { useCart } from '../context/CartContext'
import { buildWhatsAppUrl, buildProductWhatsAppMessage } from '../utils/whatsapp'
import ProductMediaGallery from '../components/ProductMediaGallery'
import ProductCard from '../components/ProductCard'
import FormattedDescription from '../components/FormattedDescription'
import Seo from '../components/Seo'
import { buildProductSchema, buildBreadcrumbSchema } from '../utils/seo'
import {
  getProductCode,
  getProductDescription,
  getProductWhatsIncluded,
  getProductSeoKeywords,
} from '../data/product-metadata'
import { SEO_WEDDING } from '../data/seo-product-names'

export default function ProductDetailPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const { allProducts, deletedProductIds } = useStoreCatalog()
  const deletedSet = useMemo(() => {
    return new Set((deletedProductIds || []).map((x) => String(x).toUpperCase()))
  }, [deletedProductIds])

  // Resolve matching product
  const product = useMemo(() => {
    if (!code) return null
    const clean = decodeURIComponent(code).trim().toLowerCase()

    // 1. Search in live allProducts first, then fallback to static products
    const catalogPool = [
      ...(allProducts || []),
      ...products,
    ]

    const match = catalogPool.find((p) => {
      const pCode = (p.code || '').toLowerCase()
      const pSku = (p.sku || '').toLowerCase()
      const pId = String(p.id || '').toLowerCase()
      const pSlug = (p.slug || '').toLowerCase()
      const pAltCode = (p.altCode || '').toLowerCase()
      const pNameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return (
        pCode === clean ||
        pAltCode === clean ||
        pSku === clean ||
        pId === clean ||
        pSlug === clean ||
        pNameSlug === clean ||
        pId === `prod-${clean}` ||
        `prod-${pId}` === clean
      )
    })

    if (!match) return null

    // Strictly respect admin deletions: deleted products must not be visible
    const matchId = String(match.id || '').toUpperCase()
    const matchCode = String(match.code || match.sku || '').toUpperCase()
    if (deletedSet.has(matchId) || (matchCode && deletedSet.has(matchCode))) {
      return null
    }

    // Merge latest live admin updates (title, price, description, images)
    if (allProducts && allProducts.length > 0) {
      const adminOverride = allProducts.find(
        (ap) =>
          String(ap.id) === String(match.id) ||
          (ap.code && ap.code.toLowerCase() === (match.code || '').toLowerCase()) ||
          (ap.sku && ap.sku.toLowerCase() === (match.code || match.sku || '').toLowerCase()) ||
          (match.sku && ap.sku && ap.sku.toLowerCase() === match.sku.toLowerCase())
      )
      if (adminOverride) {
        return {
          ...match,
          ...adminOverride,
          code: adminOverride.code || match.code || adminOverride.sku,
          sku: adminOverride.sku || match.sku || match.code,
          categorySlug: adminOverride.categorySlug || match.categorySlug,
          designNumber: adminOverride.designNumber || match.designNumber,
          images: (adminOverride.images && adminOverride.images.length > 0) ? adminOverride.images : match.images,
          image: adminOverride.images?.[0] || adminOverride.image || match.image,
        }
      }
    }
    return match
  }, [code, allProducts, deletedSet])

  // SEO document title
  useEffect(() => {
    if (product) {
      const pCode = product.code || product.sku || getProductCode(product)
      const codeSuffix = pCode ? ` [${pCode}]` : ''
      const isWedding = (product.categorySlug || '') === 'wedding-invitations'
      let wNum = null
      if (isWedding) {
        const wMatch = (pCode || '').match(/TPS-WI-(\d+)/i) || (product.images?.[0] || '').match(/wedding-invites\/design-(\d+)/i)
        wNum = wMatch ? Number(wMatch[1]) : product.designNumber
      }
      const resolvedName = product.name || (isWedding && wNum && SEO_WEDDING[wNum]) || 'Luxury Stationery Suite'
      document.title = `${resolvedName}${codeSuffix} | The Paper Story`
    } else {
      document.title = 'Design Showcase | The Paper Story'
    }
  }, [product?.id, product?.name, product?.code, product?.sku])

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center bg-paperstory-cream">
        <span className="text-4xl mb-3">🔍</span>
        <h1 className="font-serif text-2xl sm:text-3xl text-paperstory-maroon mb-2">Design Not Found</h1>
        <p className="max-w-md text-sm text-paperstory-charcoal/70 mb-6 font-sans">
          The design you're looking for ({code}) might have been moved or updated in our catalog.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop"
            className="rounded-full bg-paperstory-maroon px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-md hover:bg-paperstory-maroon-deep transition"
          >
            Explore All Collections
          </Link>
          <Link
            to="/"
            className="rounded-full border border-paperstory-maroon/30 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-paperstory-maroon hover:bg-paperstory-wash transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  const productCode = product.code || product.sku || getProductCode(product)
  const categorySlug = product.categorySlug || 'wedding-invitations'
  const isWeddingInvite = categorySlug === 'wedding-invitations'

  // Resolve catchy SEO Wedding Name ONLY if wedding invitation
  let weddingDesignNum = null
  if (isWeddingInvite) {
    const weddingNumMatch =
      (productCode || product.sku || product.id || '').match(/TPS-WI-(\d+)/i) ||
      (product.images?.[0] || '').match(/wedding-invites\/design-(\d+)/i)
    weddingDesignNum = weddingNumMatch ? Number(weddingNumMatch[1]) : (product.designNumber || null)
  }

  const defaultWeddingName =
    isWeddingInvite && weddingDesignNum && SEO_WEDDING[weddingDesignNum]
      ? SEO_WEDDING[weddingDesignNum]
      : null

  const productName = product.name || defaultWeddingName || 'Luxury Wedding Suite'
  const productDescription = product.description || getProductDescription(product, weddingDesignNum)

  // Extract About This Design text if structured, otherwise use the full description
  let aboutThisDesignText = productDescription || ''
  if (/##\s*ABOUT THIS DESIGN/i.test(aboutThisDesignText)) {
    const afterHeading = aboutThisDesignText.split(/##\s*ABOUT THIS DESIGN/i)[1] || ''
    const beforeNext = afterHeading.split(/##/)[0] || ''
    aboutThisDesignText = beforeNext.trim() || aboutThisDesignText
  }

  const rawInstagram = product.instagramUrl
  const instagramUrl = rawInstagram
    ? rawInstagram.trim().startsWith('http')
      ? rawInstagram.trim()
      : `https://${rawInstagram.trim()}`
    : ''

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image || '/wedding-invites/cover.jpg']

  const waProduct = { ...product, name: productName, code: productCode }
  const whatsappUrl = buildWhatsAppUrl(buildProductWhatsAppMessage(waProduct))
  const matchedCategory = shopCategories.find((c) => c.slug === categorySlug)
  const categoryLabel = matchedCategory?.name || product.category || 'Luxury Stationery'

  // Subcategory lookup
  const subcategorySlug = product.subcategorySlug
  const matchedSubcategory = matchedCategory?.subcategories?.find((s) => s.slug === subcategorySlug)
  const subcategoryLabel = matchedSubcategory?.name || product.subcategory || ''

  // Related products from same category
  const relatedProducts = products
    .filter((p) => {
      const isSelf =
        String(p.id) === String(product.id) ||
        (p.code && p.code.toLowerCase() === (productCode || '').toLowerCase())
      if (isSelf) return false
      return p.categorySlug === categorySlug
    })
    .slice(0, 4)

  // Dynamic Product Specifications (supporting custom admin headings & removals)
  const specsList = useMemo(() => {
    if (Array.isArray(product.specifications) && product.specifications.length > 0) {
      return product.specifications.filter((s) => s.label && s.label.trim() && s.value && s.value.trim())
    }
    const list = []
    if (product.cardSize) list.push({ label: categorySlug === 'nikkahnama' ? 'Certificate Size' : 'Card Size', value: product.cardSize })
    if (product.cardStock) list.push({ label: categorySlug === 'nikkahnama' ? 'Material / Cardstock' : isWeddingInvite ? 'Invitation Card' : 'Material', value: product.cardStock })
    if (product.envelopeStock) list.push({ label: categorySlug === 'nikkahnama' ? 'Presentation Folder' : 'Envelope', value: product.envelopeStock })
    if (product.printTechnique) list.push({ label: 'Printing Technique', value: product.printTechnique })

    if (list.length === 0) {
      if (categorySlug === 'nikkahnama') {
        return [
          { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
          { label: 'Material', value: 'Archival Heavyweight Textured Cotton Card (360–400 GSM)' },
          { label: 'Presentation Folder', value: 'Signature Protective Velvet Keepsake Folder' },
          { label: 'Printing Technique', value: 'Original Hand-Painted & Traditional Islamic Calligraphy' },
        ]
      }
      return [
        { label: 'Card Size', value: '5 × 7 inches' },
        { label: 'Invitation Card', value: '9K Textured Card (300–360 GSM)' },
        { label: 'Envelope', value: 'Art Card (300–380 GSM)' },
        { label: 'Printing Technique', value: 'Digital Printing' },
      ]
    }
    return list
  }, [product, categorySlug, isWeddingInvite])

  const minQty = product.minQuantity || (categorySlug === 'nikkahnama' ? 1 : isWeddingInvite ? 25 : 10)
  const productionTime = product.productionTime || (categorySlug === 'nikkahnama' ? '15–20 working days' : isWeddingInvite ? '20–30 working days' : '10–15 working days')

  const handleAddToCart = () => {
    addItem(product, 1)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  const handleCopyLink = () => {
    const directUrl = `https://www.thepaperstory.store/product/${encodeURIComponent(productCode)}`
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

  const pagePath = `/product/${encodeURIComponent(productCode || code)}`
  const codeLabel = productCode && !String(productCode).toUpperCase().startsWith('TPS-ACC') ? ` [${productCode}]` : ''
  const productTitle = `${productName}${codeLabel} | The Paper Story`
  const productDescriptionMeta = productDescription
    ? productDescription.slice(0, 155).replace(/[#*`_\n]/g, ' ').replace(/\s+/g, ' ').trim() + '...'
    : `${productName}. Handcrafted ${categoryLabel.toLowerCase()} by The Paper Story with bespoke foiling, wax seals & Urdu/English calligraphy. Express tracked delivery to USA, UK, UAE, Canada, Australia.`

  const productJsonLd = [
    buildProductSchema(product, pagePath),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      { name: categoryLabel, path: `/shop/${categorySlug}` },
      { name: productName, path: pagePath },
    ]),
  ]

  return (
    <div className="min-h-screen bg-paperstory-cream pt-24 sm:pt-28 pb-16">
      <Seo
        title={productTitle}
        description={productDescriptionMeta}
        path={pagePath}
        image={images?.[0] || product.image}
        jsonLd={productJsonLd}
      />
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Link & Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <Link
            to={`/shop/${categorySlug}`}
            className="inline-flex items-center gap-1.5 font-medium text-paperstory-charcoal/70 hover:text-paperstory-maroon transition"
          >
            <span>←</span>
            <span>Back to {categoryLabel}</span>
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-paperstory-charcoal/50">
            <Link to="/" className="hover:text-paperstory-maroon transition">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-paperstory-maroon transition">Shop</Link>
            <span>/</span>
            <span className="text-paperstory-maroon font-semibold truncate max-w-[150px] sm:max-w-none">
              {productCode || product.name}
            </span>
          </nav>
        </div>

        {/* Main Product Showcase Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-paperstory-maroon/10 p-5 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Media Gallery (6 cols on lg) */}
            <div className="lg:col-span-6">
              <div className="relative">
                <ProductMediaGallery
                  images={images}
                  selectedIndex={selectedImageIndex}
                  onSelectIndex={setSelectedImageIndex}
                  alt={product.name}
                />
              </div>
              <p className="mt-3 text-center text-[11px] text-paperstory-charcoal/50 italic">
                Pinch or scroll to zoom details • Tap full screen for high-res view
              </p>
            </div>

            {/* Right Column: Product Meta, Details & Purchase (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* 1. Name */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-paperstory-maroon">
                      {categoryLabel}
                    </span>
                    {productCode && !String(productCode).toUpperCase().startsWith('TPS-ACC') && (
                      <span className="rounded-full bg-paperstory-maroon/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-paperstory-maroon border border-paperstory-maroon/20">
                        Design #{productCode}
                      </span>
                    )}
                    {subcategoryLabel && (
                      <span className="rounded-full bg-paperstory-wash px-2.5 py-0.5 text-[11px] text-paperstory-charcoal/70 font-medium">
                        {subcategoryLabel}
                      </span>
                    )}
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-paperstory-charcoal leading-tight">
                    {productName}
                  </h1>
                </div>

                {/* 2. Description (About this design) */}
                <div className="pt-3 border-t border-paperstory-maroon/10">
                  <h3 className="font-serif text-xs sm:text-sm font-bold text-paperstory-maroon uppercase tracking-wider mb-1.5">
                    About This Design
                  </h3>
                  <div className="text-xs sm:text-sm text-paperstory-charcoal/80 leading-relaxed font-sans">
                    <FormattedDescription content={aboutThisDesignText} />
                  </div>
                </div>

                {/* 3. Enquire on whatsapp + insta reel (only shown if reel is added) */}
                <div className="pt-3 border-t border-paperstory-maroon/10 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${instagramUrl ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 rounded-full bg-paperstory-maroon hover:bg-paperstory-maroon-deep py-3 px-6 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm hover:shadow-md transition cursor-pointer`}
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.991.54 1.787.82 2.796.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm9.969 5.766c0 5.485-4.465 9.95-9.969 9.95-1.745 0-3.38-.453-4.81-1.246l-5.221 1.369 1.393-5.088c-.868-1.479-1.331-3.183-1.331-4.985 0-5.485 4.466-9.95 9.969-9.95 5.504 0 9.969 4.465 9.969 9.95z" />
                      </svg>
                      <span>Enquire on WhatsApp</span>
                    </a>
                    {instagramUrl ? (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 px-6 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm hover:shadow-md transition hover:opacity-95 cursor-pointer"
                        style={{
                          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                        }}
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>Watch Insta Reel</span>
                      </a>
                    ) : null}
                  </div>
                </div>

                  {/* 4. Share this design */}
                  <div className="pt-2">
                    <div className="rounded-xl border border-paperstory-maroon/15 bg-paperstory-wash/50 p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif text-[11px] font-bold uppercase tracking-wider text-paperstory-maroon">
                          Share This Design
                        </span>
                        {copiedLink && (
                          <span className="text-[11px] font-semibold text-emerald-700 animate-fadeIn">
                            Link Copied! ✓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={`https://www.thepaperstory.store/product/${encodeURIComponent(productCode)}`}
                          className="flex-1 rounded-lg border border-paperstory-maroon/20 bg-white px-2.5 py-1.5 font-mono text-[11px] text-paperstory-charcoal/80 select-all truncate"
                          onClick={(e) => e.target.select()}
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="rounded-lg bg-paperstory-maroon hover:bg-paperstory-maroon-deep px-3 py-1.5 text-xs font-semibold text-white transition shrink-0 cursor-pointer"
                        >
                          {copiedLink ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 5. Product details */}
                  <div className="pt-3 border-t border-paperstory-maroon/10">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-paperstory-maroon uppercase tracking-wider mb-2">
                      Product Details
                    </h3>
                    <div className="text-xs sm:text-[13px] text-paperstory-charcoal/85 space-y-1.5 bg-paperstory-wash/40 p-3 rounded-xl border border-paperstory-maroon/10 font-sans">
                      {specsList.map((spec, i) => (
                        <div key={i}>
                          <strong>{spec.label}:</strong> {spec.value}
                        </div>
                      ))}
                      {product.includes && (
                        <div className="pt-1.5 border-t border-paperstory-maroon/10 text-[11px] text-paperstory-charcoal/70">
                          <strong>Includes:</strong> {product.includes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 6. Production and shipping */}
                  <div className="pt-3 border-t border-paperstory-maroon/10">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-paperstory-maroon uppercase tracking-wider mb-2">
                      Production &amp; Shipping
                    </h3>
                    <div className="text-xs sm:text-[13px] text-paperstory-charcoal/85 space-y-2 bg-paperstory-wash/40 p-3 rounded-xl border border-paperstory-maroon/10 font-sans">
                      <div>
                        <strong className="text-black font-bold">Standard Production Time:</strong> {productionTime}
                      </div>
                      <div className="pt-1.5 border-t border-paperstory-maroon/10">
                        <strong className="text-black font-bold">Production Time vs. Courier Delivery:</strong> Production time is different and does not include courier transit time.
                      </div>
                      <div className="pt-1.5 border-t border-paperstory-maroon/10">
                        <strong className="text-black font-bold">Urgent Order:</strong> If you need your order earlier, contact us before placing it — we accommodate urgent orders based on schedule.
                      </div>
                      <div className="pt-1.5 border-t border-paperstory-maroon/10">
                        <strong className="text-black font-bold">Shipping Charges:</strong> Shipping charges are calculated separately and added to your order total. Shipping charges depends on weight, location and selected shipping method.
                      </div>
                    </div>
                  </div>

                  {/* 7. Premium Add-ons */}
                  <div className="pt-3 border-t border-paperstory-maroon/10">
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-paperstory-maroon uppercase tracking-wider mb-1.5">
                      Premium Add-ons
                    </h3>
                    <p className="text-xs sm:text-[13px] text-paperstory-charcoal/85 mb-2.5 font-sans">
                      Personalise your invitation with luxury finishes and decorative accents:
                    </p>
                    <Link
                      to="/shop/accessories-add-ons"
                      className="inline-flex items-center gap-1.5 rounded-full border border-paperstory-maroon/30 bg-paperstory-wash hover:bg-paperstory-maroon hover:text-white px-4 py-1.5 text-xs font-semibold text-paperstory-maroon transition shadow-xs hover:shadow-sm cursor-pointer"
                    >
                      <span>Explore all add-ons</span>
                      <span>→</span>
                    </Link>
                  </div>

                  {/* 8. Minimum order */}
                  <div className="pt-3 border-t border-paperstory-maroon/10">
                    <div className="flex items-center gap-2.5 rounded-xl bg-paperstory-wash border border-paperstory-maroon/20 p-3">
                      <span className="text-lg">📦</span>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-paperstory-maroon">
                          Minimum Order
                        </div>
                        <div className="text-xs font-semibold text-paperstory-charcoal font-sans">
                          Minimum Order Quantity: {minQty} {minQty === 1 ? 'piece' : 'pieces'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 9. Price available */}
                  <div className="pt-3 border-t border-paperstory-maroon/10">
                    {product.showPrice && product.price ? (
                      <div className="rounded-xl bg-paperstory-wash border border-paperstory-maroon/20 p-3.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-paperstory-maroon mb-1">
                          Price
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-sans text-2xl sm:text-3xl font-bold text-paperstory-maroon">
                            {product.price}
                          </span>
                          <span className="text-xs text-paperstory-charcoal/60 font-sans">
                            (Volume pricing &amp; customizations available)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 rounded-xl bg-paperstory-wash border border-paperstory-maroon/20 p-3">
                        <span className="text-lg">💰</span>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-paperstory-maroon">
                            Price Available
                          </div>
                          <div className="text-xs font-semibold text-paperstory-maroon font-sans">
                            Price Available on Inquiry
                          </div>
                          <p className="text-[11px] text-paperstory-charcoal/65 mt-0.5 font-sans">
                            Tailored quote based on your exact quantity, foil finishes, envelope liners &amp; paper choice.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 10. Ship worldwide */}
                  <div className="pt-3 border-t border-paperstory-maroon/10">
                    <div className="flex items-center justify-between rounded-xl bg-paperstory-maroon/10 border border-paperstory-maroon/20 p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">✈️</span>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-paperstory-maroon">
                            Ship Worldwide
                          </div>
                          <div className="text-[11px] text-paperstory-charcoal/75 font-sans">
                            Door-to-door tracked delivery to UK, USA, Europe, UAE, Canada, Australia &amp; Pakistan.
                          </div>
                        </div>
                      </div>
                      <Link to="/shipping" className="text-xs text-paperstory-maroon font-bold hover:underline shrink-0 ml-2">
                        Shipping Guide →
                      </Link>
                    </div>
                  </div>
                </div>
              {false && (
                <div className="space-y-5">
                {/* Header: Category Badge & Design Code */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center text-[11px] sm:text-xs font-bold uppercase tracking-widest text-paperstory-maroon">
                      <span>{categoryLabel}</span>
                    </span>

                    {productCode && !String(productCode).toUpperCase().startsWith('TPS-ACC') && (
                      <span className="rounded-full bg-paperstory-maroon/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-paperstory-maroon border border-paperstory-maroon/20">
                        Design #{productCode}
                      </span>
                    )}

                    {subcategoryLabel && (
                      <span className="rounded-full bg-paperstory-wash px-2.5 py-0.5 text-[11px] text-paperstory-charcoal/70 font-medium">
                        {subcategoryLabel}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-paperstory-charcoal leading-tight">
                    {productName}
                  </h1>

                  {product.badge && (
                    <div className="mt-2.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-950/90 border border-emerald-500/40 px-3 py-1 text-xs font-semibold text-emerald-400 shadow-xs tracking-wide">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-2.5">
                    {product.showPrice && product.price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans text-2xl sm:text-3xl font-bold text-paperstory-maroon">
                          {product.price}
                        </span>
                        <span className="text-xs text-paperstory-charcoal/60">
                          (Volume pricing & customizations available)
                        </span>
                      </div>
                    ) : (
                      <div className="inline-block rounded-lg bg-paperstory-wash/80 px-3 py-1.5 border border-paperstory-maroon/10">
                        <span className="font-serif text-sm sm:text-base font-semibold text-paperstory-maroon">
                          Price Available on Inquiry
                        </span>
                        <p className="text-[11px] text-paperstory-charcoal/65 mt-0.5">
                          Tailored quote based on your quantity, foil finish & paper choice
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Prominent Minimum Order Quantity Notice */}
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-paperstory-wash border border-paperstory-maroon/25 px-3 py-2 text-xs text-paperstory-maroon shadow-xs">
                    <div>
                      <span className="font-bold uppercase tracking-wider text-paperstory-maroon text-[11px] sm:text-xs">
                        Minimum Order Quantity: {product.minQuantity || 25} pieces
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Actions (Right under heading & price for fast access) */}
                <div className="pt-3 border-t border-paperstory-maroon/10 space-y-2.5">
                  {/* WhatsApp Inquiry Button (Pink / Maroon website brand color) */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 rounded-full bg-paperstory-maroon hover:bg-paperstory-maroon-deep py-3.5 px-6 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-md hover:shadow-lg transition cursor-pointer active:scale-98"
                  >
                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.991.54 1.787.82 2.796.82 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.766zm9.969 5.766c0 5.485-4.465 9.95-9.969 9.95-1.745 0-3.38-.453-4.81-1.246l-5.221 1.369 1.393-5.088c-.868-1.479-1.331-3.183-1.331-4.985 0-5.485 4.466-9.95 9.969-9.95 5.504 0 9.969 4.465 9.969 9.95z" />
                    </svg>
                    <span>Enquire on WhatsApp</span>
                  </a>

                  {/* Share Direct Design Link Box */}
                  <div className="rounded-xl border border-paperstory-maroon/15 bg-paperstory-wash/60 p-2.5 sm:p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif text-[11px] font-bold uppercase tracking-wider text-paperstory-maroon">
                        Share This Design
                      </span>
                      {copiedLink && (
                        <span className="text-[11px] font-semibold text-emerald-700 animate-fadeIn">
                          Link Copied! ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={`https://www.thepaperstory.store/product/${encodeURIComponent(productCode)}`}
                        className="flex-1 rounded-lg border border-paperstory-maroon/20 bg-white px-2.5 py-1.5 font-mono text-[11px] text-paperstory-charcoal/80 select-all truncate"
                        onClick={(e) => e.target.select()}
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="rounded-lg bg-paperstory-maroon hover:bg-paperstory-maroon-deep px-3 py-1.5 text-xs font-semibold text-white transition shrink-0 cursor-pointer"
                      >
                        {copiedLink ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart (if price enabled) */}
                  {product.showPrice && product.price ? (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-paperstory-maroon bg-white hover:bg-paperstory-maroon hover:text-white py-3 px-6 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-paperstory-maroon shadow-xs hover:shadow-md transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>{addedFeedback ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                    </button>
                  ) : null}

                  {/* Instagram Reel Button */}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-full py-2.5 sm:py-3 px-6 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-xs hover:shadow-md transition hover:opacity-95 cursor-pointer"
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

                  {/* Worldwide Shipping Guarantee pill */}
                  <div className="rounded-xl bg-paperstory-wash/90 border border-paperstory-maroon/10 p-2.5 flex items-center justify-between text-xs text-paperstory-charcoal">
                    <div>
                      <span className="font-semibold text-paperstory-maroon">We Ship Worldwide</span>
                      <p className="text-[11px] text-paperstory-charcoal/70">UK, USA, UAE, Canada, Australia &amp; worldwide</p>
                    </div>
                    <Link to="/shipping" className="text-[11px] font-semibold text-paperstory-maroon underline hover:text-paperstory-maroon-deep shrink-0 ml-2">
                      Delivery Times →
                    </Link>
                  </div>
                </div>

                {/* Description & Structured Details */}
                {productDescription && (
                  <div className="pt-3 border-t border-paperstory-maroon/10">
                    <FormattedDescription content={productDescription} />
                  </div>
                )}

                {/* Structured Specification Accordions (Displayed only if description does not already include Product Details) */}
                {!/##\s*PRODUCT DETAILS/i.test(productDescription || '') && (
                  <div className="pt-2 border-t border-paperstory-maroon/10 divide-y divide-paperstory-maroon/10">
                    {/* Materials & Product Details Accordion */}
                    <details className="group py-2.5" open>
                      <summary className="flex items-center justify-between text-xs sm:text-sm font-serif font-semibold text-paperstory-charcoal cursor-pointer list-none select-none hover:text-paperstory-maroon transition">
                        <span>Materials &amp; Product Details</span>
                        <span className="text-xs text-paperstory-maroon transition-transform group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="pt-2 text-xs sm:text-[13px] text-paperstory-charcoal/80 space-y-1.5 leading-relaxed">
                        {specsList.map((spec, i) => (
                          <div key={i}>
                            <strong>{spec.label}:</strong> {spec.value}
                          </div>
                        ))}
                      </div>
                    </details>

                    {/* Production & Shipping Accordion */}
                    <details className="group py-2.5" open>
                      <summary className="flex items-center justify-between text-xs sm:text-sm font-serif font-semibold text-paperstory-charcoal cursor-pointer list-none select-none hover:text-paperstory-maroon transition">
                        <span>Production &amp; Shipping</span>
                        <span className="text-xs text-paperstory-maroon transition-transform group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="pt-2 text-xs sm:text-[13px] text-paperstory-charcoal/80 space-y-1.5 leading-relaxed">
                        <div><strong>Minimum Order:</strong> {product.minQuantity || 25} pieces</div>
                        <div><strong>Standard Production:</strong> {product.productionTime || '20–30 working days'}</div>
                        <div><strong>Shipping Charges:</strong> Shipping charges are calculated separately and added to your order total. Shipping charges depends on weight, location and selected shipping method.</div>
                      </div>
                    </details>

                    {/* Premium Add-ons & Customization Accordion */}
                    <details className="group py-2.5">
                      <summary className="flex items-center justify-between text-xs sm:text-sm font-serif font-semibold text-paperstory-charcoal cursor-pointer list-none select-none hover:text-paperstory-maroon transition">
                        <span>Premium Add-ons &amp; Finishes</span>
                        <span className="text-xs text-paperstory-maroon transition-transform group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="pt-2 text-xs sm:text-[13px] text-paperstory-charcoal/80 space-y-1.5 leading-relaxed">
                        <p>
                          Personalise your invitation with additional finishes: foiling, embossing, ribbons, envelope liners, and wax seals.
                        </p>
                      </div>
                    </details>
                  </div>
                )}

                {/* Custom order note */}
                <p className="text-[11px] text-center text-paperstory-charcoal/60 pt-2 border-t border-paperstory-maroon/10">
                  Custom orders: choose paper stock, foil colors, wax seal monograms & calligraphy. Tap above to enquire directly on WhatsApp.
                </p>
              </div>
              )}

              {/* Bottom Nav inside Card */}
              <div className="pt-4 border-t border-paperstory-maroon/10 flex items-center justify-between text-xs">
                <Link
                  to={`/shop/${categorySlug}`}
                  className="font-semibold text-paperstory-maroon hover:underline flex items-center gap-1"
                >
                  <span>← Browse all {categoryLabel}</span>
                </Link>
                <Link
                  to="/shop"
                  className="text-paperstory-charcoal/60 hover:text-paperstory-maroon transition"
                >
                  All Categories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Designs Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-paperstory-maroon/70 font-semibold">
                  Complementary Suites
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-paperstory-charcoal mt-1">
                  More Designs in {categoryLabel}
                </h2>
              </div>
              <Link
                to={`/shop/${categorySlug}`}
                className="shrink-0 text-xs sm:text-sm font-semibold uppercase tracking-wider text-paperstory-maroon hover:underline flex items-center gap-1"
              >
                <span>View Full Collection</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

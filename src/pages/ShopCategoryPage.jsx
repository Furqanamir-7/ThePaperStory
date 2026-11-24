import { useState, useEffect, useMemo } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import QuickViewModal from '../components/QuickViewModal'
import CategoryFilterPills from '../components/CategoryFilterPills'
import SubcategoryPills from '../components/SubcategoryPills'
import TypePills from '../components/TypePills'
import WebsiteInviteSlider from '../components/WebsiteInviteSlider'
import Seo from '../components/Seo'
import { useStoreCatalog } from '../admin/AdminDataContext'
import {
  getCategoryBySlug,
  getProductsByCategory,
  getSubcategory,
  getType,
  normalizeCategorySlug,
  normalizeSubcategorySlug,
  products,
} from '../data/products'
import {
  buildBreadcrumbSchema,
  buildCategoryFaqSchema,
  buildItemListSchema,
  categorySeo,
  shopPath,
} from '../utils/seo'
import CategoryFaqSection from '../components/CategoryFaqSection'

export default function ShopCategoryPage() {
  const { category, subcategory, type } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const codeParam = searchParams.get('code') || searchParams.get('item') || searchParams.get('design')
  const [autoProduct, setAutoProduct] = useState(null)

  const { products: activeProducts } = useStoreCatalog()
  const normalizedCategory = normalizeCategorySlug(category)
  const normalizedSub = subcategory ? normalizeSubcategorySlug(subcategory) : null

  if (
    category !== normalizedCategory ||
    (subcategory && subcategory !== normalizedSub)
  ) {
    const parts = ['/shop', normalizedCategory]
    if (normalizedSub) parts.push(normalizedSub)
    if (type) parts.push(type)
    return <Navigate to={`${parts.join('/')}#shop-products`} replace />
  }

  const cat = getCategoryBySlug(category)
  const sub = getSubcategory(cat, subcategory)
  const occasion = getType(sub, type)
  const categoryProducts = useMemo(() => {
    return getProductsByCategory(
      category,
      subcategory || null,
      type || null,
      activeProducts
    )
  }, [category, subcategory, type, activeProducts])
  const isWebsiteInvitation = sub?.slug === 'website-invitation'

  useEffect(() => {
    if (!codeParam) {
      setAutoProduct(null)
      return
    }

    const clean = codeParam.trim().toLowerCase()
    const pool = [
      ...(categoryProducts || []),
      ...(activeProducts || []),
      ...(products || []),
    ]

    const match = pool.find((p) => {
      const pCode = (p.code || p.sku || '').toLowerCase()
      const pId = String(p.id || '').toLowerCase()
      const pSlug = (p.slug || '').toLowerCase()
      return pCode === clean || pId === clean || pSlug === clean || pId === `prod-${clean}`
    })

    if (match) {
      setAutoProduct(match)
    }
  }, [codeParam, categoryProducts, activeProducts])

  if (!cat) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 text-center">
        <h1 className="mb-4 font-serif text-3xl text-paperstory-maroon">Category not found</h1>
        <Link to="/shop" className="gradient-btn rounded-full px-6 py-3 text-sm font-semibold text-white">
          Back to Shop
        </Link>
      </div>
    )
  }

  if (subcategory && !sub) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 text-center">
        <h1 className="mb-4 font-serif text-3xl text-paperstory-maroon">Category not found</h1>
        <Link to={`/shop/${category}#shop-products`} className="gradient-btn rounded-full px-6 py-3 text-sm font-semibold text-white">
          Back to {cat.shortLabel}
        </Link>
      </div>
    )
  }

  if (type && !occasion) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 text-center">
        <h1 className="mb-4 font-serif text-3xl text-paperstory-maroon">Category not found</h1>
        <Link
          to={`/shop/${category}/${subcategory}#shop-products`}
          className="gradient-btn rounded-full px-6 py-3 text-sm font-semibold text-white"
        >
          Back to {sub.label}
        </Link>
      </div>
    )
  }

  const title = occasion
    ? `${sub.label} — ${occasion.label}`
    : sub
      ? sub.label
      : cat.label

  const headerSubtitle = sub?.tagline || cat.description || null

  const breadcrumb = occasion
    ? `Home / Shop / ${cat.shortLabel} / ${sub.label} / ${occasion.label}`
    : sub
      ? `Home / Shop / ${cat.shortLabel} / ${sub.label}`
      : `Home / Shop / ${cat.shortLabel}`

  const gridTitle = occasion ? occasion.label : sub ? sub.label : cat.label
  const gridSubtitle = sub?.tagline || cat.description || null
  const pagePath = shopPath(normalizedCategory, normalizedSub, type || null)
  const seo = categorySeo(cat, sub, occasion)
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: cat.shortLabel, path: `/shop/${normalizedCategory}` },
  ]

  if (sub) {
    breadcrumbItems.push({
      name: sub.label,
      path: `/shop/${normalizedCategory}/${normalizedSub}`,
    })
  }

  if (occasion) {
    breadcrumbItems.push({
      name: occasion.label,
      path: pagePath,
    })
  }

  const structuredData = [
    buildBreadcrumbSchema(breadcrumbItems),
    buildCategoryFaqSchema(normalizedCategory, cat?.label || 'Wedding Stationery'),
    ...(categoryProducts.length
      ? [buildItemListSchema(categoryProducts, pagePath, title)]
      : []),
  ]

  return (
    <>
      <Seo
        title={seo.title}
        description={seo.description}
        path={pagePath}
        jsonLd={structuredData}
      />
      <PageHeader
        compact
        title={title}
        subtitle={headerSubtitle}
        subtitleItalic={Boolean(sub?.tagline)}
        breadcrumb={breadcrumb}
      />
      <section className={`bg-paperstory-cream ${isWebsiteInvitation ? 'website-invite-section pb-2' : 'pb-8'}`}>
        <div className="mx-auto max-w-7xl space-y-4 px-4 pt-4 sm:px-6 lg:px-8">
          <CategoryFilterPills activeSlug={normalizedCategory} />
          <SubcategoryPills category={cat} activeSubSlug={normalizedSub} />
          {sub?.types?.length > 0 && (
            <TypePills category={cat} subcategory={sub} activeTypeSlug={type || null} />
          )}
        </div>

        {isWebsiteInvitation ? (
          <WebsiteInviteSlider
            image={sub.image}
            href={sub.externalUrl}
            title={sub.label}
            subtitle="Tap the invitation to open the live wedding website."
          />
        ) : (
          <ProductGrid
            compactTop
            showOnLoad
            title={gridTitle}
            subtitle={gridSubtitle}
            subtitleItalic={Boolean(sub?.tagline)}
            items={categoryProducts}
          />
        )}

        <CategoryFaqSection
          categorySlug={normalizedCategory}
          categoryName={cat?.label || 'Wedding Stationery'}
        />

        <div className={`text-center ${isWebsiteInvitation ? 'pt-3 pb-2' : 'pt-6'}`}>
          <Link to="/shop" className="text-sm font-medium text-paperstory-maroon hover:underline">
            View all products
          </Link>
        </div>
      </section>

      {/* Auto-open direct design modal from WhatsApp / Direct Link */}
      {autoProduct && (
        <QuickViewModal
          product={autoProduct}
          onClose={() => {
            setAutoProduct(null)
            const p = new URLSearchParams(searchParams)
            p.delete('code')
            p.delete('item')
            p.delete('design')
            setSearchParams(p, { replace: true })
          }}
        />
      )}
    </>
  )
}

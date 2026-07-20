import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import CategoryFilterPills from '../components/CategoryFilterPills'
import SubcategoryPills from '../components/SubcategoryPills'
import Seo from '../components/Seo'
import { getCategoryBySlug, getProductsByCategory, getSubcategory } from '../data/products'
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  categorySeo,
  shopPath,
} from '../utils/seo'

export default function ShopCategoryPage() {
  const { category, subcategory } = useParams()
  const cat = getCategoryBySlug(category)
  const sub = getSubcategory(cat, subcategory)
  const categoryProducts = getProductsByCategory(category, subcategory || null)

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

  const title = sub ? `${cat.label} — ${sub.label}` : cat.label
  const breadcrumb = sub
    ? `Home / Shop / ${cat.shortLabel} / ${sub.label}`
    : `Home / Shop / ${cat.shortLabel}`
  const pagePath = shopPath(category, subcategory || null)
  const seo = categorySeo(cat, sub)
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: cat.shortLabel, path: `/shop/${category}` },
  ]

  if (sub) {
    breadcrumbItems.push({
      name: sub.label,
      path: pagePath,
    })
  }

  const structuredData = [
    buildBreadcrumbSchema(breadcrumbItems),
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
      <PageHeader compact title={title} subtitle={cat.description} breadcrumb={breadcrumb} />
      <section className="bg-paperstory-cream pb-8">
        <div className="mx-auto max-w-7xl space-y-4 px-4 pt-4 sm:px-6 lg:px-8">
          <CategoryFilterPills activeSlug={category} />
          <SubcategoryPills category={cat} activeSubSlug={subcategory || null} />
        </div>
        <ProductGrid
          compactTop
          showOnLoad
          title={sub ? sub.label : cat.label}
          subtitle={sub ? `Browse ${sub.label.toLowerCase()} designs.` : cat.description}
          items={categoryProducts}
        />
        <div className="pt-6 text-center">
          <Link to="/shop" className="text-sm font-medium text-paperstory-maroon hover:underline">
            ← View all products
          </Link>
        </div>
      </section>
    </>
  )
}

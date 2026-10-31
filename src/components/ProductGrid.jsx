import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function ProductGrid({
  title = 'Featured Collection',
  subtitle = "Curated stationery and gifting pieces, crafted with care for life's most beautiful moments.",
  subtitleItalic = false,
  items,
  limit,
  showViewAll = false,
  id = 'shop-products',
  compactTop = false,
  showOnLoad = false,
  showToolbar = true,
}) {
  const [ref, isVisible] = useInView()
  const [sortBy, setSortBy] = useState('featured')
  const baseProducts = items ?? products
  const isVisibleNow = showOnLoad || isVisible
  const isFeatured = isFeaturedCollection || (Boolean(title) && title.toLowerCase().includes("featured"))

  const sortedProducts = useMemo(() => {
    const customItems = baseProducts.filter(p => p.id?.toString().includes('customised') || p.id?.toString().includes('custom-design'))
    const standardItems = baseProducts.filter(p => !p.id?.toString().includes('customised') && !p.id?.toString().includes('custom-design'))

    const list = [...standardItems]
    if (sortBy === 'a-z') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'z-a') {
      list.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => {
        const pA = parseFloat(String(a.price || '').replace(/[^0-9.]/g, '')) || 999999
        const pB = parseFloat(String(b.price || '').replace(/[^0-9.]/g, '')) || 999999
        return pA - pB
      })
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => {
        const pA = parseFloat(String(a.price || '').replace(/[^0-9.]/g, '')) || 0
        const pB = parseFloat(String(b.price || '').replace(/[^0-9.]/g, '')) || 0
        return pB - pA
      })
    }
    return [...list, ...customItems]
  }, [baseProducts, sortBy])

  const displayProducts = sortedProducts.slice(0, limit ?? undefined)

  const spacing = compactTop
    ? 'pt-3 pb-8 sm:pt-5 sm:pb-12'
    : 'py-6 sm:py-16'

  // Show toolbar when viewing full category or multiple products
  const shouldShowToolbar = showToolbar && baseProducts.length > 3 && !limit

  return (
    <section id={id} className={`scroll-mt-24 bg-paperstory-cream ${spacing}`}>
      <div ref={ref} className={`mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 fade-in-up ${isVisibleNow ? 'visible' : ''}`}>
        {/* Section Header */}
        <div className={`text-center ${compactTop ? 'mb-4 sm:mb-7' : 'mb-6 sm:mb-10'}`}>
          <h2 className="heading-brand mb-1.5 text-2xl font-semibold sm:mb-3 sm:text-4xl">{title}</h2>
          {subtitle && (
            <p
              className={`mx-auto max-w-xl text-xs text-paperstory-ink/75 sm:text-base ${
                subtitleItalic ? 'font-serif italic' : ''
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Pocket of Beige Style Collection Toolbar: Product Count & Sort */}
        {shouldShowToolbar && (
          <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-paperstory-maroon/15 pb-3 px-1 text-xs text-paperstory-ink/80">
            <span className="font-sans font-medium text-[11px] sm:text-xs tracking-wider uppercase text-paperstory-maroon/80">
              {displayProducts.length} {displayProducts.length === 1 ? 'Design' : 'Designs'}
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="grid-sort" className="hidden sm:inline font-sans text-xs text-paperstory-ink/70">
                Sort by:
              </label>
              <select
                id="grid-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-paperstory-maroon/20 bg-white px-3 py-1 text-xs font-medium text-paperstory-ink focus:border-paperstory-maroon focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="a-z">Alphabetically, A-Z</option>
                <option value="z-a">Alphabetically, Z-A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* 2-Column Mobile Grid, 3-Column Tablet, 4-Column Desktop (Shopify / Pocket of Beige Standard) */}
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-5 sm:gap-x-4 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} inFeaturedCollection={isFeatured} />
          ))}
        </div>

        {showViewAll && (
          <div className="mt-8 text-center sm:mt-12">
            <Link
              to="/shop"
              className="gradient-btn inline-flex rounded-full px-8 py-3 text-xs sm:text-sm font-semibold text-white uppercase tracking-wider shadow-md hover:opacity-95 transition"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function ProductGrid({
  title = 'Featured Collection',
  subtitle = "Curated stationery and gifting pieces, crafted with care for life's most beautiful moments.",
  items,
  limit,
  showViewAll = false,
  id = 'shop-products',
  compactTop = false,
  showOnLoad = false,
}) {
  const [ref, isVisible] = useInView()
  const displayProducts = (items ?? products).slice(0, limit ?? undefined)
  const isVisibleNow = showOnLoad || isVisible

  const spacing = compactTop
    ? 'pt-4 pb-8 sm:pt-5 sm:pb-10'
    : 'py-12 sm:py-16'

  return (
    <section id={id} className={`scroll-mt-24 bg-paperstory-cream ${spacing}`}>
      <div ref={ref} className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisibleNow ? 'visible' : ''}`}>
        <div className={`text-center ${compactTop ? 'mb-8' : 'mb-10'}`}>
          <h2 className="heading-brand mb-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
          {subtitle && <p className="mx-auto max-w-xl text-sm text-paperstory-ink/75 sm:text-base">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {showViewAll && (
          <div className="mt-10 text-center">
            <Link to="/shop" className="gradient-btn inline-flex rounded-full px-8 py-3 text-sm font-semibold text-white uppercase">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

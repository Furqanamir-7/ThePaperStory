import { useInView } from '../hooks/useInView'
import { products } from '../data/products'
import ProductCard from './ProductCard'

export default function ProductGrid() {
  const [ref, isVisible] = useInView()

  return (
    <section id="shop" className="bg-white py-16 sm:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-serif text-3xl font-semibold text-paperstory-maroon sm:text-4xl">
            Featured Collection
          </h2>
          <p className="mx-auto max-w-xl text-sm text-gray-600 sm:text-base">
            Curated stationery and gifting pieces, crafted with care for life's most beautiful moments.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

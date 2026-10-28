import { useInView } from '../hooks/useInView'
import CategoryFilterPills from './CategoryFilterPills'
import CategoryCard from './CategoryCard'
import { shopCategories } from '../data/products'

export default function CategoryStrip() {
  const [ref, isVisible] = useInView()

  return (
    <section className="bg-paperstory-cream pb-6 pt-12 sm:pb-8 sm:pt-16">
      <div ref={ref} className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}>
        <CategoryFilterPills activeSlug={null} />
        <h2 className="heading-brand mb-8 mt-10 text-center text-3xl font-semibold sm:text-4xl">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {shopCategories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} compact />
          ))}
        </div>
      </div>
    </section>
  )
}

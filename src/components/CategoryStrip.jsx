import { useInView } from '../hooks/useInView'
import { categories } from '../data/products'

export default function CategoryStrip() {
  const [ref, isVisible] = useInView()

  return (
    <section id="categories" className="bg-paperstory-cream py-16 sm:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-paperstory-maroon sm:text-4xl">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#shop"
              className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-paperstory-blush to-paperstory-cream text-2xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20 sm:text-3xl">
                {cat.icon}
              </div>
              <span className="text-center text-xs font-medium text-gray-700 transition-colors group-hover:text-paperstory-maroon sm:text-sm">
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

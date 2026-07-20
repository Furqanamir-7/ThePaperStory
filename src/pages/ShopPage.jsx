import PageHeader from '../components/PageHeader'
import CategoryFilterPills from '../components/CategoryFilterPills'
import CategoryCard from '../components/CategoryCard'
import Seo from '../components/Seo'
import { shopCategories } from '../data/products'
import { useInView } from '../hooks/useInView'
import { PAGE_SEO } from '../utils/seo'

export default function ShopPage() {
  const [ref, isVisible] = useInView()

  return (
    <>
      <Seo
        title={PAGE_SEO.shop.title}
        description={PAGE_SEO.shop.description}
        path="/shop"
      />
      <PageHeader
        compact
        title="Shop"
        subtitle="Luxury Stationery Designed for Every Celebration."
        breadcrumb="Home / Shop"
      />
      <section className="bg-paperstory-cream pb-10">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <CategoryFilterPills activeSlug={null} />
        </div>
        <div ref={ref} className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h2 className="heading-brand mb-6 mt-6 text-center text-3xl font-semibold sm:text-4xl">
            Browse by Product
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shopCategories.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

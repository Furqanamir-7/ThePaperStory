import PageHeader from '../components/PageHeader'
import CategoryFilterPills from '../components/CategoryFilterPills'
import CategoryCard from '../components/CategoryCard'
import ProductGrid from '../components/ProductGrid'
import Seo from '../components/Seo'
import { products, shopCategories } from '../data/products'
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
      <section className="bg-paperstory-cream pb-12">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-4">
          <CategoryFilterPills activeSlug={null} />
        </div>

        {/* Pocket of Beige Style Product Grid on /shop */}
        <ProductGrid
          compactTop
          showOnLoad
          title="All Collections & Invitations"
          subtitle="Explore our bespoke wedding invites, digital cards, stationery, and handcrafted gifting suites."
          items={products}
        />

        {/* Categories Section */}
        <div ref={ref} className={`mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-paperstory-maroon/15 fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h2 className="heading-brand mb-6 text-center text-2xl font-semibold sm:text-3xl">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {shopCategories.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

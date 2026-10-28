import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import PaperStoryDifference from '../components/PaperStoryDifference'
import OurStoryHome from '../components/OurStoryHome'
import RealWeddings from '../components/RealWeddings'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import Seo from '../components/Seo'
import { getBestSellers, getFeaturedProducts } from '../data/products'
import { buildOrganizationSchema, PAGE_SEO } from '../utils/seo'

export default function HomePage() {
  return (
    <>
      <Seo
        title={PAGE_SEO.home.title}
        description={PAGE_SEO.home.description}
        path="/"
        jsonLd={buildOrganizationSchema()}
      />
      <Hero />
      <ProductGrid
        title="Featured Collection"
        subtitle="Our top picks and best-selling designs, hand-selected for life's most beautiful moments."
        items={getFeaturedProducts()}
        showViewAll
      />
      <PaperStoryDifference />
      <OurStoryHome />
      <ProductGrid
        id="best-sellers"
        title="Best Sellers"
        subtitle="The designs our clients love most — from wedding invites to favours and packaging."
        items={getBestSellers()}
        showViewAll
      />
      <RealWeddings />
      <Testimonials />
      <Newsletter />
    </>
  )
}

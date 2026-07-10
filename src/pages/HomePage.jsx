import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import PaperStoryDifference from '../components/PaperStoryDifference'
import OurStoryHome from '../components/OurStoryHome'
import RealWeddings from '../components/RealWeddings'
import InstagramGallery from '../components/InstagramGallery'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import { getBestSellers, getFeaturedProducts } from '../data/products'

export default function HomePage() {
  return (
    <>
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
        subtitle="The designs our clients love most — from invitations to everyday stationery."
        items={getBestSellers()}
        showViewAll
      />
      <RealWeddings />
      <InstagramGallery />
      <Testimonials />
      <Newsletter />
    </>
  )
}

import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import { getFeaturedProducts } from '../data/products'

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
      <Testimonials />
      <Newsletter />
    </>
  )
}

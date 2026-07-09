import { useState } from 'react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryStrip from './components/CategoryStrip'
import ProductGrid from './components/ProductGrid'
import BrandStory from './components/BrandStory'
import Testimonials from './components/Testimonials'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Navbar />
      <main>
        <Hero />
        <CategoryStrip />
        <ProductGrid />
        <BrandStory />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

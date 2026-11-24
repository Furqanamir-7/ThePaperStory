import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import InstagramShowcase from '../components/InstagramShowcase'
import PaperStoryDifference from '../components/PaperStoryDifference'
import OurStoryHome from '../components/OurStoryHome'
import WorldwideHome from '../components/WorldwideHome'
import RealWeddings from '../components/RealWeddings'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import Seo from '../components/Seo'
import { getBestSellers } from '../data/products'
import { useStoreCatalog } from '../admin/AdminDataContext'
import { buildOrganizationSchema, buildFaqSchema, getCountrySeo, PAGE_SEO } from '../utils/seo'
import { getLocaleFromPath } from '../config/locales'

export default function HomePage() {
  const location = useLocation()
  const { products: activeProducts } = useStoreCatalog()
  const bestSellers = useMemo(() => getBestSellers(activeProducts), [activeProducts])
  const activeLocale = getLocaleFromPath(location.pathname)
  const countryInfo = activeLocale?.country ? getCountrySeo(activeLocale.country) : null

  // Localized meta tags for /us, /uk, /ae, /ca, /au, etc. for Googlebot & search engines
  const pageTitle = countryInfo ? countryInfo.title : PAGE_SEO.home.title
  const pageDescription = countryInfo ? countryInfo.description : PAGE_SEO.home.description

  const jsonLdSchemas = [
    buildOrganizationSchema(),
    buildFaqSchema(activeLocale?.country),
  ]

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path={location.pathname || '/'}
        jsonLd={jsonLdSchemas}
      />
      <Hero />

      {/* 1. About the Paper Story */}
      <OurStoryHome />

      {/* 2. Worldwide */}
      <WorldwideHome />

      {/* 3. Real Moments */}
      <RealWeddings />

      {/* 4. The Paper Story Difference */}
      <PaperStoryDifference />

      {/* 5. Best Sellers */}
      <ProductGrid
        id="best-sellers"
        title="Best Sellers"
        subtitle=""
        items={bestSellers}
        isFeaturedCollection={true}
        showViewAll
      />

      {/* 6. Follow Us on Instagram */}
      <InstagramShowcase />

      {/* 7. Reviews */}
      <Testimonials />

      <Newsletter />
    </>
  )
}

import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ShopPage from './pages/ShopPage'
import ShopCategoryPage from './pages/ShopCategoryPage'
import ContactPage from './pages/ContactPage'

function AppContent() {
  const location = useLocation()
  const [loaderMode, setLoaderMode] = useState('initial')
  const prevPath = useRef(null)

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = location.pathname
      return
    }
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname
      setLoaderMode('route')
    }
  }, [location.pathname])

  const showLoader = loaderMode !== null

  return (
    <>
      {showLoader && (
        <Loader
          quick={loaderMode === 'route'}
          onComplete={() => setLoaderMode(null)}
        />
      )}
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category/:subcategory/:type" element={<ShopCategoryPage />} />
          <Route path="/shop/:category/:subcategory" element={<ShopCategoryPage />} />
          <Route path="/shop/:category" element={<ShopCategoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  )
}

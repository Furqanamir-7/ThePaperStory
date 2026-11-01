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
import CartPage from './pages/CartPage'
import { CartProvider } from './context/CartContext'

// Admin Portal imports
import { AdminDataProvider } from './admin/AdminDataContext'
import { AdminAuthProvider, AdminAuthGuard } from './admin/AdminAuthGuard'
import AdminLayout from './admin/AdminLayout'
import LoginPage from './admin/pages/LoginPage'
import DashboardPage from './admin/pages/DashboardPage'
import ProductsPage from './admin/pages/ProductsPage'
import CategoriesPage from './admin/pages/CategoriesPage'
import OrdersPage from './admin/pages/OrdersPage'
import ReviewsPage from './admin/pages/ReviewsPage'
import DealsPage from './admin/pages/DealsPage'
import MarqueePage from './admin/pages/MarqueePage'
import PaymentsPage from './admin/pages/PaymentsPage'
import MediaPage from './admin/pages/MediaPage'
import SettingsPage from './admin/pages/SettingsPage'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const [loaderMode, setLoaderMode] = useState('initial')
  const prevPath = useRef(null)

  useEffect(() => {
    if (isAdminRoute) return // No public loader on admin

    if (prevPath.current === null) {
      prevPath.current = location.pathname
      return
    }
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname
      setLoaderMode('route')
    }
  }, [location.pathname, isAdminRoute])

  const showLoader = !isAdminRoute && loaderMode !== null

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminAuthGuard>
              <AdminLayout />
            </AdminAuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="marquee" element={<MarqueePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    )
  }

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
          <Route path="/cart" element={<CartPage />} />
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
      <AdminAuthProvider>
        <AdminDataProvider>
          <CartProvider>
            <ScrollToTop />
            <AppContent />
          </CartProvider>
        </AdminDataProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}

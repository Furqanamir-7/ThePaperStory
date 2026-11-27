import React, { useState, useEffect, useRef } from 'react'
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
import InvoicePage from './pages/InvoicePage'
import ShippingPage from './pages/ShippingPage'
import ProductDetailPage from './pages/ProductDetailPage'
import { CartProvider } from './context/CartContext'
import { pingSupabaseKeepAlive } from './utils/supabase'

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
import SeoAnalyticsPage from './admin/pages/SeoAnalyticsPage'

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[Global Storefront Error Caught]:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF9F5',
          padding: '24px',
          fontFamily: 'serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid #EADBDD',
            borderRadius: '20px',
            padding: '40px 28px',
            boxShadow: '0 10px 40px rgba(166, 35, 65, 0.08)'
          }}>
            <img
              src="/logo.png"
              alt="The Paper Story"
              style={{ width: '64px', height: '64px', margin: '0 auto 16px', display: 'block', borderRadius: '50%' }}
            />
            <h1 style={{ fontSize: '24px', color: '#2B1B1F', margin: '0 0 10px', fontWeight: '700' }}>
              The Paper Story
            </h1>
            <p style={{ fontSize: '14px', color: '#7A6A6E', margin: '0 0 24px', lineHeight: '1.6', fontFamily: 'sans-serif' }}>
              We are updating our luxury stationery collection. Please tap below to refresh the page.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                backgroundColor: '#A62341',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px 28px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'sans-serif'
              }}
            >
              ↻ Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

class AdminRootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[Admin Root Crash Caught]:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF9F5',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid #EADBDD',
            borderRadius: '16px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(166, 35, 65, 0.08)'
          }}>
            <div style={{ fontSize: '42px', marginBottom: '14px' }}>⚠️</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2B1B1F', margin: '0 0 8px' }}>
              Admin Panel Render Error
            </h2>
            <p style={{ fontSize: '13px', color: '#7A6A6E', margin: '0 0 24px', lineHeight: '1.5' }}>
              {this.state.error?.message || 'An unexpected rendering error occurred in the management portal.'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                style={{
                  backgroundColor: '#A62341',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ↻ Reload Admin
              </button>
              <a
                href="/"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#F7EFF1',
                  color: '#4B3B3F',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: '600',
                  fontSize: '13px',
                  textDecoration: 'none'
                }}
              >
                Storefront
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const [loaderMode, setLoaderMode] = useState('initial')
  const prevPath = useRef(null)

  // Automatic Supabase keepalive ping on site visits to prevent 7-day inactivity pause
  useEffect(() => {
    pingSupabaseKeepAlive();
  }, [])

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
      <AdminRootErrorBoundary>
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
            <Route path="seo" element={<SeoAnalyticsPage />} />
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
      </AdminRootErrorBoundary>
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
          {/* Base routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category/:subcategory/:type" element={<ShopCategoryPage />} />
          <Route path="/shop/:category/:subcategory" element={<ShopCategoryPage />} />
          <Route path="/shop/:category" element={<ShopCategoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/invoice" element={<InvoicePage />} />
          <Route path="/product/:code" element={<ProductDetailPage />} />
          <Route path="/p/:code" element={<ProductDetailPage />} />
          <Route path="/design/:code" element={<ProductDetailPage />} />

          {/* Regional / Country SEO routes: /us, /uk, /pk, /ae, /ca, /au, /en-us, /en-gb, /en-pk, etc. */}
          <Route path="/:country" element={<HomePage />} />
          <Route path="/:country/about" element={<AboutPage />} />
          <Route path="/:country/shop" element={<ShopPage />} />
          <Route path="/:country/shop/:category/:subcategory/:type" element={<ShopCategoryPage />} />
          <Route path="/:country/shop/:category/:subcategory" element={<ShopCategoryPage />} />
          <Route path="/:country/shop/:category" element={<ShopCategoryPage />} />
          <Route path="/:country/contact" element={<ContactPage />} />
          <Route path="/:country/cart" element={<CartPage />} />
          <Route path="/:country/shipping" element={<ShippingPage />} />
          <Route path="/:country/invoice" element={<InvoicePage />} />
          <Route path="/:country/product/:code" element={<ProductDetailPage />} />
          <Route path="/:country/p/:code" element={<ProductDetailPage />} />
          <Route path="/:country/design/:code" element={<ProductDetailPage />} />

          {/* Fallback catch-all to ensure no route ever renders a blank page */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default function App() {
  return (
    <GlobalErrorBoundary>
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
    </GlobalErrorBoundary>
  )
}

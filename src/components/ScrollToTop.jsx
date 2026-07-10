import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const HEADER_OFFSET = 100

export function scrollToShopProducts(behavior = 'smooth') {
  requestAnimationFrame(() => {
    const el = document.getElementById('shop-products')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior })
  })
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname === '/shop') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    if (hash === '#shop-products') {
      scrollToShopProducts('smooth')
      return
    }

    if (pathname.startsWith('/shop/')) {
      scrollToShopProducts('auto')
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

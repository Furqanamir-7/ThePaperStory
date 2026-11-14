import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useAdminData } from '../admin/AdminDataContext'

export default function ProductRedirectPage() {
  const { code } = useParams()
  const navigate = useNavigate()

  let adminProducts = null
  try {
    const admin = useAdminData()
    if (admin && admin.products) {
      adminProducts = admin.products
    }
  } catch (e) {
    // Outside admin data context
  }

  const allProducts = useMemo(() => {
    if (adminProducts && adminProducts.length > 0) {
      return [...adminProducts, ...products]
    }
    return products
  }, [adminProducts])

  useEffect(() => {
    if (!code) {
      navigate('/shop', { replace: true })
      return
    }

    const clean = decodeURIComponent(code).trim().toLowerCase()
    const match = allProducts.find((p) => {
      const pCode = (p.code || p.sku || '').toLowerCase()
      const pId = String(p.id || '').toLowerCase()
      const pSlug = (p.slug || '').toLowerCase()
      const pAltCode = (p.altCode || '').toLowerCase()
      return pCode === clean || pAltCode === clean || pId === clean || pSlug === clean
    })

    if (match) {
      const cat = match.categorySlug || 'wedding-invitations'
      const sub = match.subcategorySlug ? `/${match.subcategorySlug}` : ''
      const type = match.typeSlug ? `/${match.typeSlug}` : ''
      const codeParam = match.code || match.sku || match.id
      navigate(`/shop/${cat}${sub}${type}?code=${encodeURIComponent(codeParam)}#shop-products`, { replace: true })
    } else {
      navigate('/shop', { replace: true })
    }
  }, [code, allProducts, navigate])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 text-center bg-paperstory-cream">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-paperstory-maroon border-t-transparent mb-4" />
      <p className="font-serif text-sm tracking-wider uppercase text-paperstory-maroon/80">Opening design...</p>
    </div>
  )
}


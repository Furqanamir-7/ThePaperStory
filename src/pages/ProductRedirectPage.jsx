import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useStoreCatalog } from '../admin/AdminDataContext'

export default function ProductRedirectPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { products: activeProducts, allProducts, deletedProductIds } = useStoreCatalog()

  const deletedSet = useMemo(() => {
    return new Set((deletedProductIds || []).map((x) => String(x).toUpperCase()))
  }, [deletedProductIds])

  const catalogPool = useMemo(() => {
    if (activeProducts && activeProducts.length > 0) {
      return [...activeProducts, ...products]
    }
    return products
  }, [activeProducts])

  useEffect(() => {
    if (!code) {
      navigate('/shop', { replace: true })
      return
    }

    const clean = decodeURIComponent(code).trim().toLowerCase()
    const match = catalogPool.find((p) => {
      const pCode = (p.code || p.sku || '').toLowerCase()
      const pId = String(p.id || '').toLowerCase()
      const pSlug = (p.slug || '').toLowerCase()
      const pAltCode = (p.altCode || '').toLowerCase()
      return pCode === clean || pAltCode === clean || pId === clean || pSlug === clean || pId === `prod-${clean}`
    })

    const matchId = String(match?.id || '').toUpperCase()
    const matchCode = String(match?.code || match?.sku || '').toUpperCase()

    if (match && !deletedSet.has(matchId) && (!matchCode || !deletedSet.has(matchCode))) {
      const cat = match.categorySlug || 'wedding-invitations'
      const sub = match.subcategorySlug ? `/${match.subcategorySlug}` : ''
      const type = match.typeSlug ? `/${match.typeSlug}` : ''
      const codeParam = match.code || match.sku || match.id
      navigate(`/shop/${cat}${sub}${type}?code=${encodeURIComponent(codeParam)}#shop-products`, { replace: true })
    } else {
      navigate('/shop', { replace: true })
    }
  }, [code, catalogPool, deletedSet, navigate])
  }, [code, allProducts, navigate])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 text-center bg-paperstory-cream">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-paperstory-maroon border-t-transparent mb-4" />
      <p className="font-serif text-sm tracking-wider uppercase text-paperstory-maroon/80">Opening design...</p>
    </div>
  )
}


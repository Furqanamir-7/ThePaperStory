import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { calculateCartTotal } from '../utils/orderPricing'

const STORAGE_KEY = 'paperstory-cart'

const CartContext = createContext(null)

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function productToCartItem(product, quantity = 1) {
  return {
    productId: product.id,
    name: product.name,
    category: product.category,
    categorySlug: product.categorySlug,
    subcategorySlug: product.subcategorySlug,
    price: product.price,
    priceNote: product.priceNote ?? null,
    image: product.image,
    quantity: Math.max(1, Number(quantity) || 1),
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1)
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }
      return [...prev, productToCartItem(product, qty)]
    })
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1)
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: qty } : item))
    )
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const total = useMemo(() => calculateCartTotal(items), [items])

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      totalItems: () => itemCount,
      total,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart, itemCount, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

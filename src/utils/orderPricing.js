import { calculatePenOrderTotal, formatOrderTotalPkr } from './penPricing'

export function parsePricePkr(priceStr) {
  const match = priceStr?.match(/[\d,]+/)
  return match ? Number(match[0].replace(/,/g, '')) : 0
}

export function calculateLineTotal(item) {
  const qty = Math.max(1, Number(item.quantity) || 1)
  if (item.subcategorySlug === 'pens') {
    return calculatePenOrderTotal(qty)
  }
  return parsePricePkr(item.price) * qty
}

export function calculateCartTotal(items = []) {
  return items.reduce((sum, item) => sum + calculateLineTotal(item), 0)
}

export function formatLineTotal(item) {
  return formatOrderTotalPkr(calculateLineTotal(item))
}

export function cartItemToOrderLine(item) {
  return {
    productId: item.productId,
    productName: item.name,
    category: item.category,
    quantity: item.quantity,
    lineTotal: formatLineTotal(item),
  }
}

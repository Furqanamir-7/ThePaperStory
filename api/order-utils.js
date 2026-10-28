export function generateReferenceNumber(prefix = 'TPS') {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(1000 + Math.random() * 9000))
  return `${prefix}-${yy}${mm}${dd}-${seq}`
}

export function generateOrderNumber() {
  return generateReferenceNumber('TPS')
}

export function generateInquiryNumber() {
  return generateReferenceNumber('TPS-INQ')
}

export function formatFullAddress(order) {
  const lines = [order.address]
  if (order.addressLine2) lines.push(order.addressLine2)
  const cityLine = [order.city, order.postalCode, order.country].filter(Boolean).join(', ')
  if (cityLine) lines.push(cityLine)
  return lines.join('\n')
}

export function formatOrderSummary(order) {
  const items = order.items?.length
    ? order.items
    : [
        {
          productName: order.productName,
          quantity: order.quantity || 1,
          lineTotal: order.price,
          category: order.category,
        },
      ]

  const itemLines = items.map(
    (item) =>
      `  • ${item.productName} (x${item.quantity}) — ${item.lineTotal || order.price}`
  )

  return [
    `Order #: ${order.orderNumber}`,
    items.length === 1 ? `Product: ${items[0].productName}` : `Products: ${items.length} items`,
    order.selectedDesign ? `Design: ${order.selectedDesign}` : null,
    order.category ? `Category: ${order.category}` : null,
    'Item(s):',
    ...itemLines,
    `Total: ${order.price}`,
    `Quantity: ${order.quantity || items.reduce((sum, item) => sum + (item.quantity || 1), 0)}`,
    `Payment: ${order.paymentType === 'cod' ? 'Cash on Delivery (Pakistan)' : 'Advance payment'}`,
    `Expected delivery: ${order.deliveryEstimate || '5–7 business days'}`,
    '',
    `Customer: ${order.name}`,
    `Email: ${order.email}`,
    `Phone: ${order.phone}`,
    `Address:\n${formatFullAddress(order)}`,
    order.notes ? `Notes: ${order.notes}` : null,
    order.marketingConsent ? 'Marketing opt-in: Yes' : null,
  ]
    .filter(Boolean)
    .join('\n')
}

export function formatInquirySummary(inquiry) {
  return [
    `Inquiry #: ${inquiry.inquiryNumber}`,
    `Product: ${inquiry.productName}`,
    `Category: ${inquiry.category}`,
    '',
    `Customer: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Address:\n${formatFullAddress(inquiry)}`,
    inquiry.notes ? `Notes: ${inquiry.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

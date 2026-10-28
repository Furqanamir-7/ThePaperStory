export const PEN_UNIT_PRICE = 250
export const PEN_PACK_SIZE = 2
export const PEN_PACK_PRICE = 450

export function formatPenPriceLabel() {
  return `PKR ${PEN_UNIT_PRICE}`
}

export function formatPenPriceNote() {
  return `Pack of 2 = PKR ${PEN_PACK_PRICE}`
}

/** Pairs at pack price; any leftover single at unit price. */
export function calculatePenOrderTotal(quantity) {
  const qty = Math.max(1, Number(quantity) || 1)
  const pairs = Math.floor(qty / PEN_PACK_SIZE)
  const singles = qty % PEN_PACK_SIZE
  return pairs * PEN_PACK_PRICE + singles * PEN_UNIT_PRICE
}

export function formatOrderTotalPkr(total) {
  return `PKR ${total}`
}

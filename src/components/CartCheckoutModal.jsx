import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  DEFAULT_COUNTRY,
  DELIVERY_ESTIMATE,
  MARKETING_CONSENT_SHORT,
  ORDER_CONSENT_SHORT,
  PAKISTAN_CITIES,
  PHONE_COUNTRY_CODES,
  PRIVACY_NOTICE_SHORT,
  SHIPPING_COUNTRIES,
} from '../data/checkout'
import { useCart } from '../context/CartContext'
import { submitOrder } from '../utils/placeOrder'
import { formatOrderTotalPkr } from '../utils/penPricing'
import { cartItemToOrderLine, formatLineTotal } from '../utils/orderPricing'

const emptyForm = {
  name: '',
  email: '',
  phoneCode: '+92',
  phone: '',
  address: '',
  addressLine2: '',
  city: '',
  cityOther: '',
  country: DEFAULT_COUNTRY,
  postalCode: '',
  notes: '',
  consent: false,
  marketingConsent: false,
}

function CityField({ form, setForm, isPakistan }) {
  if (!isPakistan) {
    return (
      <input
        type="text"
        required
        placeholder="City"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
        className="order-modal-input"
      />
    )
  }

  if (form.city === 'Other') {
    return (
      <input
        type="text"
        required
        placeholder="Your city"
        value={form.cityOther}
        onChange={(e) => setForm({ ...form, cityOther: e.target.value })}
        className="order-modal-input"
      />
    )
  }

  return (
    <select
      required
      value={form.city}
      onChange={(e) => setForm({ ...form, city: e.target.value, cityOther: '' })}
      className="order-modal-input"
      aria-label="City"
    >
      <option value="">City</option>
      {PAKISTAN_CITIES.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  )
}

export default function CartCheckoutModal({ onClose, onSuccess }) {
  const { items, total, clearCart } = useCart()
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const totalLabel = formatOrderTotalPkr(total)
  const deliveryEstimate = DELIVERY_ESTIMATE.onlineFree

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const isPakistan = form.country === 'Pakistan'
  const cityValue = form.city === 'Other' ? form.cityOther : form.city

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'loading' || !items.length) return

    if (!form.consent) {
      setError('Please agree to receive order updates via WhatsApp and Email.')
      return
    }

    if (!cityValue?.trim()) {
      setError('Please enter your city.')
      return
    }

    setStatus('loading')
    setError('')

    const orderItems = items.map(cartItemToOrderLine)
    const productName =
      items.length === 1 ? items[0].name : `${items.length} items (${items.map((i) => i.name).join(', ')})`

    try {
      const data = await submitOrder({
        productName,
        category: 'Stationary Items',
        price: totalLabel,
        paymentType: 'advance',
        items: orderItems,
        name: form.name,
        email: form.email,
        phone: `${form.phoneCode} ${form.phone}`.trim(),
        address: form.address,
        addressLine2: form.addressLine2,
        city: cityValue,
        country: form.country,
        postalCode: form.postalCode,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        notes: form.notes,
        consent: form.consent,
        marketingConsent: form.marketingConsent,
        deliveryEstimate,
      })
      setOrderNumber(data.orderNumber)
      clearCart()
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return createPortal(
    <div className="order-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="order-modal order-modal--cart"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-checkout-title"
      >
        <button type="button" className="order-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {status === 'success' ? (
          <div className="order-modal-success">
            <h2 id="cart-checkout-title" className="heading-brand mb-2 text-lg font-semibold">
              Order confirmed
            </h2>
            <p className="mb-2 text-sm leading-relaxed text-gray-600">
              Hi {form.name}, your order <strong>#{orderNumber}</strong> is confirmed.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Confirmation sent to <strong>{form.email}</strong>.
            </p>
            <button
              type="button"
              className="cute-btn-primary order-modal-submit mt-4 w-full"
              onClick={() => {
                onSuccess?.()
                onClose()
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="order-modal-header">
              <h2 id="cart-checkout-title" className="heading-brand font-semibold">
                Checkout
              </h2>
              <p className="text-paperstory-ink/75">
                {items.length} item{items.length === 1 ? '' : 's'} · {totalLabel} · Pay online · Free delivery
              </p>
            </div>

            <div className="cart-checkout-summary">
              {items.map((item) => (
                <div key={item.productId} className="cart-checkout-line">
                  <span className="cart-checkout-line-name">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="cart-checkout-line-total">{formatLineTotal(item)}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="order-modal-form">
              <div className="order-modal-grid-2">
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="order-modal-input"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="order-modal-input"
                />
              </div>

              <div className="order-modal-phone">
                <select
                  required
                  value={form.phoneCode}
                  onChange={(e) => setForm({ ...form, phoneCode: e.target.value })}
                  className="order-modal-input"
                  aria-label="Country code"
                >
                  {PHONE_COUNTRY_CODES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  placeholder="Phone / WhatsApp"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="order-modal-input"
                />
              </div>

              <div className="order-modal-grid-2">
                <input
                  type="text"
                  required
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="order-modal-input"
                />
                <input
                  type="text"
                  placeholder="Apt / landmark"
                  value={form.addressLine2}
                  onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                  className="order-modal-input"
                />
              </div>

              <div className="order-modal-grid-2">
                <select
                  required
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value, city: '', cityOther: '' })
                  }
                  className="order-modal-input"
                  aria-label="Country"
                >
                  {SHIPPING_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <CityField form={form} setForm={setForm} isPakistan={isPakistan} />
              </div>

              <input
                type="text"
                placeholder="Postal / ZIP"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="order-modal-input"
              />

              <textarea
                rows={2}
                placeholder="Order notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="order-modal-input order-modal-input--textarea"
              />

              <label className="order-modal-check">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  required
                />
                <span>{ORDER_CONSENT_SHORT}</span>
              </label>

              <label className="order-modal-check order-modal-check--optional">
                <input
                  type="checkbox"
                  checked={form.marketingConsent}
                  onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })}
                />
                <span>{MARKETING_CONSENT_SHORT}</span>
              </label>

              <p className="order-modal-fineprint">{PRIVACY_NOTICE_SHORT}</p>

              {error && <p className="text-xs text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="cute-btn-primary order-modal-submit w-full disabled:opacity-60"
              >
                {status === 'loading' ? 'Placing order…' : `Confirm order · ${totalLabel}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

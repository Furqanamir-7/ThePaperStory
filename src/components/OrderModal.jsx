import { useState } from 'react'
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
import { submitOrder } from '../utils/placeOrder'

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
  quantity: 1,
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

export default function OrderModal({ product, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  if (!product) return null

  const isCod = product.paymentType === 'cod'
  const totalLabel = product.price
  const deliveryEstimate = isCod ? DELIVERY_ESTIMATE.cod : DELIVERY_ESTIMATE.advance
  const isPakistan = form.country === 'Pakistan'
  const cityValue = form.city === 'Other' ? form.cityOther : form.city

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'loading') return

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

    try {
      const data = await submitOrder({
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
        paymentType: product.paymentType,
        name: form.name,
        email: form.email,
        phone: `${form.phoneCode} ${form.phone}`.trim(),
        address: form.address,
        addressLine2: form.addressLine2,
        city: cityValue,
        country: form.country,
        postalCode: form.postalCode,
        quantity: Number(form.quantity) || 1,
        notes: form.notes,
        consent: form.consent,
        marketingConsent: form.marketingConsent,
        deliveryEstimate,
      })
      setOrderNumber(data.orderNumber)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <div className="order-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="order-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <button type="button" className="order-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {status === 'success' ? (
          <div className="order-modal-success">
            <h2 id="order-modal-title" className="heading-brand mb-2 text-lg font-semibold">
              Order confirmed
            </h2>
            <p className="mb-2 text-sm leading-relaxed text-gray-600">
              Hi {form.name}, your order <strong>#{orderNumber}</strong> is confirmed.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Confirmation sent to <strong>{form.email}</strong>.
            </p>
            <button type="button" className="cute-btn-primary order-modal-submit mt-4 w-full" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="order-modal-header">
              <h2 id="order-modal-title" className="heading-brand font-semibold">
                Place order
              </h2>
              <p className="text-paperstory-ink/75">
                {product.name} · {totalLabel}
                {isCod ? ' · COD' : ' · Advance'}
              </p>
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

              <div className="order-modal-grid-2">
                <input
                  type="text"
                  placeholder="Postal / ZIP"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="order-modal-input"
                />
                <input
                  type="number"
                  min={1}
                  max={99}
                  required
                  placeholder="Qty"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="order-modal-input"
                />
              </div>

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
                {status === 'loading' ? 'Placing order…' : 'Confirm order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

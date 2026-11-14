import { useEffect, useMemo, useState } from 'react'
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
import { submitOrder } from '../utils/placeOrder'
import {
  calculatePenOrderTotal,
  formatOrderTotalPkr,
  formatPenPriceNote,
} from '../utils/penPricing'
import InvoiceModal, { BANK_DETAILS } from './InvoiceModal'

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
  const [showInvoice, setShowInvoice] = useState(false)

  const isPen = product?.subcategorySlug === 'pens'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const quantity = Math.max(1, Number(form.quantity) || 1)

  const orderTotal = useMemo(() => {
    if (isPen) return calculatePenOrderTotal(quantity)
    const match = product?.price?.match(/[\d,]+/)
    const unit = match ? Number(match[0].replace(/,/g, '')) : 0
    return unit * quantity
  }, [isPen, product?.price, quantity])

  const totalLabel = formatOrderTotalPkr(orderTotal)

  if (!product) return null

  const isCod = product.paymentType === 'cod'
  const orderOnline = Boolean(product.orderOnline)
  const deliveryEstimate = orderOnline
    ? DELIVERY_ESTIMATE.onlineFree
    : isCod
      ? DELIVERY_ESTIMATE.cod
      : DELIVERY_ESTIMATE.advance
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
        price: totalLabel,
        paymentType: product.paymentType,
        name: form.name,
        email: form.email,
        phone: `${form.phoneCode} ${form.phone}`.trim(),
        address: form.address,
        addressLine2: form.addressLine2,
        city: cityValue,
        country: form.country,
        postalCode: form.postalCode,
        quantity,
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

  return createPortal(
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
          <div className="order-modal-success p-1 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 id="order-modal-title" className="heading-brand mb-1 text-xl font-bold text-paperstory-ink">
              Order Confirmed!
            </h2>
            <p className="mb-1 text-xs leading-relaxed text-gray-600">
              Hi <strong>{form.name}</strong>, your order is recorded. Confirmation sent to <strong>{form.email}</strong>.
            </p>
            <p className="text-xs font-mono font-bold text-paperstory-maroon mb-3">
              Order #{orderNumber}
            </p>

            {/* Direct Option to View & Download Invoice */}
            <div className="flex flex-col gap-2 my-3">
              <button
                type="button"
                className="cute-btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                onClick={() => setShowInvoice(true)}
              >
                <span>🧾 View & Download Official Invoice</span>
              </button>
            </div>

            {/* HBL Bank Transfer Box */}
            <div className="rounded-xl border border-paperstory-maroon/20 bg-[#FAF6F0] p-3 text-left text-xs my-2">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-paperstory-maroon/15">
                <span className="font-bold text-paperstory-maroon text-[11px] uppercase tracking-wider">
                  HBL Bank Details (50% Advance)
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">Online Payment</span>
              </div>
              <div className="space-y-1 text-neutral-800 text-[11px]">
                <div><span className="text-neutral-500">Account Title:</span> <strong>{BANK_DETAILS.name}</strong></div>
                <div><span className="text-neutral-500">Account #:</span> <strong className="font-mono text-neutral-900">{BANK_DETAILS.accountNumber}</strong></div>
                <div><span className="text-neutral-500">IBAN:</span> <strong className="font-mono text-[10px] text-neutral-900">{BANK_DETAILS.iban}</strong></div>
                <div><span className="text-neutral-500">Bank:</span> <strong>{BANK_DETAILS.bank}</strong></div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 italic mt-2 mb-3">
              Kindly share your advance payment receipt on WhatsApp to begin production.
            </p>

            <button type="button" className="cute-btn-secondary text-xs w-full py-2" onClick={onClose}>
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
                {orderOnline ? ' · Pay online · Free delivery' : isCod ? ' · COD' : ' · Advance'}
              </p>
              {isPen && (
                <p className="mt-1 text-xs font-medium text-paperstory-maroon/90">
                  {product.price} each · {product.priceNote || formatPenPriceNote()}
                </p>
              )}
              {orderOnline && (
                <p className="mt-2 text-xs font-medium text-paperstory-maroon">
                  Complete payment online to get free delivery within Pakistan.
                </p>
              )}
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

              {isPen && quantity >= 2 && (
                <p className="order-modal-pack-hint">
                  {quantity} pens = {totalLabel} (includes pack pricing where applicable)
                </p>
              )}

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

      {showInvoice && (
        <InvoiceModal
          order={{
            number: orderNumber,
            customerName: form.name,
            phone: `${form.phoneCode} ${form.phone}`.trim(),
            email: form.email,
            shippingAddress: `${form.address}${form.addressLine2 ? ', ' + form.addressLine2 : ''}`,
            city: cityValue,
            country: form.country,
            items: [
              {
                productName: product.name,
                quantity,
                unitPrice: isPen ? product.price : totalLabel,
                lineTotal: totalLabel,
              },
            ],
            total: totalLabel,
            paymentMethod: orderOnline ? 'Online Bank Transfer' : isCod ? 'Cash on Delivery' : 'Advance Payment',
            paymentStatus: 'Advance Due (50%)',
            notes: form.notes,
            createdAt: new Date().toISOString(),
          }}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>,
    document.body
  )
}

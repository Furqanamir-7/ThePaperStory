import { useState } from 'react'
import {
  DEFAULT_COUNTRY,
  MARKETING_CONSENT_TEXT,
  ORDER_CONSENT_TEXT,
  PAKISTAN_CITIES,
  PHONE_COUNTRY_CODES,
  PRIVACY_NOTICE,
  SHIPPING_COUNTRIES,
} from '../data/checkout'
import { submitInquiry } from '../utils/submitInquiry'

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

export default function InquiryModal({ product, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [inquiryNumber, setInquiryNumber] = useState('')

  if (!product) return null

  const isPakistan = form.country === 'Pakistan'
  const cityValue = form.city === 'Other' ? form.cityOther : form.city

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'loading') return

    if (!form.consent) {
      setError('Please agree to receive updates via WhatsApp and Email.')
      return
    }

    if (!cityValue?.trim()) {
      setError('Please enter your city.')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const data = await submitInquiry({
        productId: product.id,
        productName: product.name,
        category: product.category,
        name: form.name,
        email: form.email,
        phone: `${form.phoneCode} ${form.phone}`.trim(),
        address: form.address,
        addressLine2: form.addressLine2,
        city: cityValue,
        country: form.country,
        postalCode: form.postalCode,
        notes: form.notes,
        consent: form.consent,
        marketingConsent: form.marketingConsent,
      })
      setInquiryNumber(data.inquiryNumber)
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
        aria-labelledby="inquiry-modal-title"
      >
        <button type="button" className="order-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {status === 'success' ? (
          <div className="order-modal-success">
            <h2 id="inquiry-modal-title" className="heading-brand mb-2 text-xl font-semibold">
              Inquiry received
            </h2>
            <p className="mb-2 text-sm leading-relaxed text-gray-600">
              Hi {form.name}, thanks for reaching out about <strong>{product.name}</strong>.
            </p>
            <p className="mb-2 text-sm leading-relaxed text-gray-600">
              Your inquiry reference is <strong>{inquiryNumber}</strong>.
            </p>
            <p className="text-sm leading-relaxed text-gray-600">
              Our team will get back to you shortly with pricing and details. A confirmation email has been sent to{' '}
              <strong>{form.email}</strong>.
            </p>
            <button type="button" className="cute-btn-primary mt-5 w-full" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="inquiry-modal-title" className="heading-brand mb-1 text-xl font-semibold">
              Request custom order
            </h2>
            <p className="mb-4 text-sm text-paperstory-ink/75">
              {product.category} — {product.name} · Price on request
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="order-modal-input"
              />
              <div className="grid grid-cols-[7.5rem_1fr] gap-3">
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
              <input
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="order-modal-input"
              />
              <input
                type="text"
                required
                placeholder="Address line 1"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="order-modal-input"
              />
              <input
                type="text"
                placeholder="Address line 2 (optional)"
                value={form.addressLine2}
                onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                className="order-modal-input"
              />
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
              {isPakistan ? (
                <select
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="order-modal-input"
                  aria-label="City"
                >
                  <option value="">Select city</option>
                  {PAKISTAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="order-modal-input"
                />
              )}
              {isPakistan && form.city === 'Other' && (
                <input
                  type="text"
                  required
                  placeholder="Enter your city"
                  value={form.cityOther}
                  onChange={(e) => setForm({ ...form, cityOther: e.target.value })}
                  className="order-modal-input"
                />
              )}
              <input
                type="text"
                placeholder="Postal / ZIP code"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="order-modal-input"
              />
              <textarea
                rows={3}
                placeholder="Tell us about your design, quantity, or event date"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="order-modal-input resize-none"
              />

              <label className="order-modal-check">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  required
                />
                <span>{ORDER_CONSENT_TEXT}</span>
              </label>

              <label className="order-modal-check order-modal-check--optional">
                <input
                  type="checkbox"
                  checked={form.marketingConsent}
                  onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })}
                />
                <span>{MARKETING_CONSENT_TEXT}</span>
              </label>

              <p className="order-modal-fineprint">{PRIVACY_NOTICE}</p>

              {error && <p className="text-sm text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="cute-btn-primary w-full disabled:opacity-60"
              >
                {status === 'loading' ? 'Submitting…' : 'Submit inquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

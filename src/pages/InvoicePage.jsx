import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import html2pdf from 'html2pdf.js'
import { BANK_DETAILS, TERMS_AND_CONDITIONS, printInvoiceDocument } from '../components/InvoiceModal'

export default function InvoicePage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('id') || searchParams.get('order') || 'TPS-INV'
  const [order, setOrder] = useState(null)
  const [copiedField, setCopiedField] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // Attempt to load order from admin store (checking current v3 first, then legacy keys)
    try {
      const keys = ['tps_admin_data_v3', 'tps_admin_data_v2', 'tps_admin_data_v1']
      for (const k of keys) {
        const raw = localStorage.getItem(k)
        if (raw) {
          const parsed = JSON.parse(raw)
          const found = (parsed.orders || []).find(
            (o) => o.number === orderId || o.id === orderId || (o.number && o.number.toLowerCase() === orderId.toLowerCase())
          )
          if (found) {
            setOrder(found)
            return
          }
        }
      }
    } catch (e) {
      console.warn('Could not read admin order:', e)
    }

    // Fallback order structure if query params provided or standalone view
    const customer = searchParams.get('name') || 'Valued Client'
    const total = searchParams.get('total') || 'On Request'
    const phone = searchParams.get('phone') || ''

    setOrder({
      number: orderId,
      customerName: customer,
      phone,
      total,
      items: [
        {
          productName: searchParams.get('item') || 'Bespoke Stationery & Invitation Suite',
          quantity: 1,
          unitPrice: total,
          lineTotal: total,
        },
      ],
      createdAt: new Date().toISOString(),
    })
  }, [orderId, searchParams])

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handlePrint = () => {
    printInvoiceDocument(order)
  }

  const handleDownloadPdf = async () => {
    const card = document.getElementById('public-invoice-card')
    if (!card) return
    setIsDownloading(true)
    try {
      const opt = {
        margin: [8, 10, 8, 10],
        filename: `The-Paper-Story-Invoice-${order.number || 'INV'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }
      await html2pdf().set(opt).from(card).save()
    } catch (err) {
      console.error('PDF error:', err)
      printInvoiceDocument(order)
    } finally {
      setIsDownloading(false)
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] p-4 text-center">
        <p className="font-serif text-lg text-paperstory-ink">Loading Invoice...</p>
      </div>
    )
  }

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB')
  const totalDisplay = order.total || 'On Request'
  const subtotalDisplay = order.subtotal || totalDisplay
  const discountDisplay = order.discount
    ? (String(order.discount).trim().startsWith('PKR') ? order.discount : `PKR ${order.discount}`)
    : null
  const rawDelivery = order.deliveryCharges || order.delivery || order.shippingFee || order.shipping
  const deliveryDisplay = rawDelivery
    ? (String(rawDelivery).trim().startsWith('PKR') ? String(rawDelivery).trim() : `PKR ${String(rawDelivery).trim()}`)
    : null
  const items = order.items || []

  return (
    <div className="min-h-screen bg-[#F6F1EA] py-8 px-3 sm:px-6">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #public-invoice-card, #public-invoice-card * {
            visibility: visible !important;
          }
          #public-invoice-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Floating Header Bar */}
      <div className="no-print mx-auto max-w-2xl mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-paperstory-maroon hover:underline"
        >
          &larr; Back to The Paper Story
        </Link>
        <div className="flex items-center gap-2">
          {/* Download Invoice Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-paperstory-maroon px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-paperstory-maroon-deep active:scale-95 transition disabled:opacity-60 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isDownloading ? 'Generating PDF...' : 'Download Invoice'}</span>
          </button>

          {/* Print Invoice Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-paperstory-maroon/40 bg-white px-3.5 py-2 text-xs font-semibold text-paperstory-maroon shadow-xs hover:bg-[#FAF6F0] active:scale-95 transition cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Card */}
      <div
        id="public-invoice-card"
        className="mx-auto max-w-2xl bg-white rounded-2xl shadow-xl border border-paperstory-maroon/15 p-6 sm:p-10 text-neutral-800"
      >
        {/* Brand & Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-paperstory-maroon pb-6">
          <div className="flex items-center gap-3.5">
            <img src="/logo.png" alt="The Paper Story" className="h-14 w-14 rounded-full shadow-xs shrink-0" />
            <div>
              <h1 className="font-sans text-xl sm:text-2xl font-extrabold tracking-wider text-paperstory-maroon uppercase">
                The Paper Story
              </h1>
              <p className="text-xs text-neutral-500 font-medium tracking-wide">
                Luxury Invitations & Bespoke Stationery
              </p>
              <p className="text-[11px] text-neutral-500">
                Lahore, Pakistan • WhatsApp: +92 314 4392928
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-block font-sans text-2xl sm:text-3xl font-extrabold tracking-widest text-neutral-900 uppercase">
              Invoice
            </span>
            <div className="mt-1 flex sm:justify-end items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">Invoice #:</span>
              <span className="text-xs font-bold text-paperstory-maroon font-mono">{order.number}</span>
            </div>
            <div className="flex sm:justify-end items-center gap-2 text-xs text-neutral-500">
              <span>Invoice Date:</span>
              <span className="font-semibold text-neutral-800">{orderDate}</span>
            </div>
            <div className="flex sm:justify-end items-center gap-2 text-xs text-neutral-500">
              <span>Due Date:</span>
              <span className="font-semibold text-neutral-800">{orderDate}</span>
            </div>
          </div>
        </div>

        {/* Bill To & Order Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-neutral-200">
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-paperstory-maroon/10">
            <span className="text-[10px] font-bold tracking-widest text-paperstory-maroon uppercase block mb-1">
              Bill To
            </span>
            <p className="font-serif text-base font-bold text-neutral-900">{order.customerName}</p>
            {order.phone && <p className="text-xs text-neutral-700 mt-0.5"><strong>Phone:</strong> {order.phone}</p>}
            {order.email && <p className="text-xs text-neutral-700 mt-0.5"><strong>Email:</strong> {order.email}</p>}
            {order.shippingAddress && (
              <p className="text-xs text-neutral-600 mt-1 whitespace-pre-line leading-relaxed">
                <strong>Address:</strong> {order.shippingAddress}
              </p>
            )}
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-paperstory-maroon/10 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-paperstory-maroon uppercase block mb-1">
                Order Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block rounded-full bg-paperstory-maroon/10 border border-paperstory-maroon/20 px-2.5 py-0.5 text-xs font-semibold text-paperstory-maroon">
                  {order.paymentStatus || 'Advance Due (50%)'}
                </span>
                <span className="text-xs text-neutral-500">({order.paymentMethod || 'Online Bank Transfer'})</span>
              </div>
            </div>
            {order.notes && (
              <p className="mt-2 text-xs text-neutral-600 italic bg-white/70 p-2 rounded border border-neutral-200">
                "{order.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6">
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paperstory-maroon text-white font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3 text-center">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {items.map((it, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                    <td className="py-3 px-3 font-medium text-neutral-900">{it.productName}</td>
                    <td className="py-3 px-3 text-center text-neutral-700">{it.quantity}</td>
                    <td className="py-3 px-3 text-right text-neutral-700">{it.unitPrice || it.lineTotal || totalDisplay}</td>
                    <td className="py-3 px-3 text-right font-bold text-neutral-900">{it.lineTotal || it.unitPrice || totalDisplay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col items-end">
            <div className="w-full sm:w-72 space-y-1.5 text-xs text-neutral-700">
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="font-medium text-neutral-600">Subtotal:</span>
                <span className="font-semibold text-neutral-900">{subtotalDisplay}</span>
              </div>
              {discountDisplay && (
                <div className="flex justify-between py-1 border-b border-neutral-200 text-paperstory-maroon font-semibold">
                  <span>Discount:</span>
                  <span>-{discountDisplay}</span>
                </div>
              )}
              {deliveryDisplay && (
                <div className="flex justify-between py-1 border-b border-neutral-200 text-sky-800 font-semibold">
                  <span>Delivery Charges:</span>
                  <span>+{deliveryDisplay}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 bg-[#FAF6F0] px-2.5 rounded border border-paperstory-maroon/20 text-sm font-bold text-paperstory-maroon">
                <span>Grand Total:</span>
                <span>Rs {totalDisplay.replace(/[^0-9,]/g, '') || totalDisplay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs text-neutral-600 mb-4">
          <strong>Notes:</strong> Online Payment Only.
        </div>

        {/* Bank Details Card (EXACT from screenshot) */}
        <div className="mb-6 rounded-xl border border-paperstory-maroon/25 bg-[#FAF6F0] p-4 text-xs">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-paperstory-maroon/15">
            <span className="font-bold text-paperstory-maroon uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              Official Bank Details
            </span>
            <span className="text-[10px] text-paperstory-maroon font-semibold bg-white px-2 py-0.5 rounded border border-paperstory-maroon/20">
              HBL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-800">
            <div><span className="text-neutral-500 font-medium">Account Title:</span> <strong className="text-neutral-900">{BANK_DETAILS.name}</strong></div>
            <div><span className="text-neutral-500 font-medium">Bank:</span> <strong className="text-neutral-900">{BANK_DETAILS.bank}</strong></div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-medium">Account #:</span> <strong className="font-mono text-neutral-900">{BANK_DETAILS.accountNumber}</strong>
              <button
                type="button"
                onClick={() => handleCopy(BANK_DETAILS.accountNumber, 'acc')}
                className="no-print text-[10px] text-paperstory-maroon hover:underline font-semibold"
              >
                {copiedField === 'acc' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-medium">IBAN:</span> <strong className="font-mono text-neutral-900 text-[11px]">{BANK_DETAILS.iban}</strong>
              <button
                type="button"
                onClick={() => handleCopy(BANK_DETAILS.iban, 'iban')}
                className="no-print text-[10px] text-paperstory-maroon hover:underline font-semibold"
              >
                {copiedField === 'iban' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div><span className="text-neutral-500 font-medium">City:</span> <span>{BANK_DETAILS.city}</span></div>
            <div><span className="text-neutral-500 font-medium">Country:</span> <span>{BANK_DETAILS.country}</span></div>
          </div>
        </div>

        {/* Terms & Conditions (EXACT from screenshot) */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 text-xs text-neutral-700">
          <span className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] block mb-2">
            Terms & Conditions
          </span>
          <ul className="space-y-1.5 leading-relaxed text-neutral-600 text-[11px]">
            {TERMS_AND_CONDITIONS.map((term, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-paperstory-maroon font-bold select-none">•</span>
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-200 text-center text-[11px] text-neutral-500 font-serif italic">
          Thank you for choosing The Paper Story. Crafted with love to be remembered forever.
        </div>
      </div>
    </div>
  )
}


import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import html2pdf from 'html2pdf.js'

export const BANK_DETAILS = {
  name: 'Fatima Ahsan',
  accountNumber: '50097918251603',
  bank: 'HBL (Habib Bank Limited)',
  iban: 'PK33HABB0050097918251603',
  city: 'Lahore',
  country: 'Pakistan',
}

export const TERMS_AND_CONDITIONS = [
  '50% Advance to be paid before Production, 50% after production (before delivery)',
  'Delivery Charges will be included at the end of the order, depending on the weight and mode of delivery',
  'We own the rights to post and market the products designed & created by us.',
  'Advance Payment is NON REFUNDABLE.',
]

export function printInvoiceDocument(order) {
  if (!order) return
  const orderNumber = order.number || order.orderNumber || order.id || 'TPS-INV'
  const customerName = order.customerName || order.name || 'Valued Client'
  const customerPhone = order.phone || ''
  const customerEmail = order.email || ''
  const customerAddress = order.shippingAddress || order.address || ''
  const customerCity = order.city || ''
  const notes = order.notes || ''
  const paymentStatus = order.paymentStatus || 'Advance Due (50%)'
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB')
  const totalDisplay = order.total || order.price || 'On Request'
  const subtotalDisplay = order.subtotal || totalDisplay
  const discountDisplay = order.discount
    ? (String(order.discount).trim().startsWith('PKR') ? order.discount : `PKR ${order.discount}`)
    : null
  const rawDelivery = order.deliveryCharges || order.delivery || order.shippingFee || order.shipping
  const deliveryDisplay = rawDelivery
    ? (String(rawDelivery).trim().startsWith('PKR') ? String(rawDelivery).trim() : `PKR ${String(rawDelivery).trim()}`)
    : null

  let items = []
  if (Array.isArray(order.items) && order.items.length > 0) {
    items = order.items
  } else if (order.productName) {
    items = [
      {
        productName: order.productName,
        quantity: order.quantity || 1,
        unitPrice: order.price || order.total || 'On Request',
        lineTotal: order.price || order.total || 'On Request',
      },
    ]
  } else {
    items = [
      {
        productName: 'Custom Bespoke Stationery Suite',
        quantity: 1,
        unitPrice: totalDisplay,
        lineTotal: totalDisplay,
      },
    ]
  }

  const logoUrl = window.location.origin + '/logo.png'

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${orderNumber} - The Paper Story</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 14mm 10mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #2B1B1F;
      background: #FFFFFF;
      font-size: 11.5px;
      line-height: 1.4;
    }
    .invoice-wrap {
      max-width: 100%;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2.5px solid #A31E3B;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    .brand-name {
      font-size: 20px;
      font-weight: 800;
      color: #A31E3B;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0;
      line-height: 1.1;
    }
    .brand-tagline {
      font-size: 11px;
      color: #555;
      margin: 2px 0 0;
      font-weight: 500;
    }
    .brand-sub {
      font-size: 10px;
      color: #777;
      margin: 1px 0 0;
    }
    .header-right {
      text-align: right;
    }
    .inv-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #111;
      text-transform: uppercase;
      margin: 0;
      line-height: 1;
    }
    .inv-meta {
      margin-top: 3px;
      font-size: 11px;
      color: #555;
    }
    .inv-meta strong {
      color: #A31E3B;
      font-family: monospace;
      font-size: 12px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }
    .card {
      background: #FAF7F2;
      border: 1px solid #EADBDD;
      border-radius: 8px;
      padding: 10px 14px;
    }
    .card-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #A31E3B;
      text-transform: uppercase;
      margin-bottom: 4px;
      display: block;
    }
    .client-name {
      font-size: 14px;
      font-weight: 700;
      color: #111;
      margin: 0 0 3px;
    }
    .table-wrap {
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    th {
      background: #A31E3B !important;
      color: #FFFFFF !important;
      padding: 8px 10px;
      text-align: left;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 10px;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #E5E7EB;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:nth-child(even) {
      background: #FAFAFA;
    }
    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 14px;
    }
    .totals-box {
      width: 240px;
      font-size: 11px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px solid #E5E7EB;
    }
    .totals-row.grand {
      background: #FAF6F0 !important;
      border: 1px solid #D4A3AE !important;
      border-radius: 4px;
      padding: 5px 8px;
      margin-top: 3px;
      color: #A31E3B;
      font-weight: 700;
      font-size: 13px;
    }
    .bank-box {
      background: #FAF6F0 !important;
      border: 1px solid #E5C3CA;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 12px;
      font-size: 11px;
    }
    .bank-title {
      font-weight: 800;
      color: #A31E3B;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 6px;
      padding-bottom: 3px;
      border-bottom: 1px solid #EADBDD;
      display: flex;
      justify-content: space-between;
    }
    .bank-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 16px;
    }
    .bank-grid div strong {
      color: #111;
    }
    .terms-box {
      background: #F9FAFB !important;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 10px;
      color: #4B5563;
    }
    .terms-title {
      font-weight: 700;
      color: #111;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 4px;
      font-size: 9px;
    }
    .terms-box ul {
      margin: 0;
      padding-left: 14px;
    }
    .terms-box li {
      margin-bottom: 2px;
    }
    .footer-note {
      text-align: center;
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px solid #E5E7EB;
      font-size: 10px;
      color: #777;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="invoice-wrap">
    <div class="header">
      <div class="brand-left">
        <img class="brand-logo" src="${logoUrl}" alt="Logo" />
        <div>
          <h1 class="brand-name">The Paper Story</h1>
          <p class="brand-tagline">Luxury Invitations & Bespoke Stationery</p>
          <p class="brand-sub">Lahore, Pakistan • WhatsApp: +92 314 4392928</p>
        </div>
      </div>
      <div class="header-right">
        <h2 class="inv-title">Invoice</h2>
        <div class="inv-meta">Invoice #: <strong>${orderNumber}</strong></div>
        <div class="inv-meta">Invoice Date: ${orderDate}</div>
        <div class="inv-meta">Due Date: ${orderDate}</div>
      </div>
    </div>

    <div class="details-grid">
      <div class="card">
        <span class="card-label">Bill To</span>
        <div class="client-name">${customerName}</div>
        ${customerPhone ? `<div><strong>Phone:</strong> ${customerPhone}</div>` : ''}
        ${customerEmail ? `<div><strong>Email:</strong> ${customerEmail}</div>` : ''}
        ${customerAddress ? `<div><strong>Address:</strong> ${customerAddress}${customerCity ? ', ' + customerCity : ''}</div>` : ''}
      </div>
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span class="card-label">Payment & Order Status</span>
          <div style="margin-top: 3px;">
            <span style="background: #F3D9DF; color: #A31E3B; font-weight: 700; padding: 2px 8px; border-radius: 999px; font-size: 10px; border: 1px solid #E5B2BC;">
              ${paymentStatus}
            </span>
          </div>
          <div style="font-size: 10px; color: #666; margin-top: 3px;">
            Method: ${order.paymentMethod || 'Online Bank Transfer'}
          </div>
        </div>
        ${notes ? `<div style="font-size: 10px; font-style: italic; color: #666; background: #fff; padding: 3px 6px; border-radius: 4px; border: 1px solid #EADBDD; margin-top: 4px;">Note: "${notes}"</div>` : ''}
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width: 55%;">Item Name</th>
            <th style="width: 15%; text-align: center;">Quantity</th>
            <th style="width: 15%; text-align: right;">Rate</th>
            <th style="width: 15%; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (it) => `<tr>
                <td style="font-weight: 600;">${it.productName}</td>
                <td style="text-align: center;">${it.quantity}</td>
                <td style="text-align: right;">${it.unitPrice || it.lineTotal || totalDisplay}</td>
                <td style="text-align: right; font-weight: 700;">${it.lineTotal || it.unitPrice || totalDisplay}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="totals-area">
      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>${subtotalDisplay}</span>
        </div>
        ${discountDisplay ? `
        <div class="totals-row" style="color: #A31E3B;">
          <span>Discount:</span>
          <span>-${discountDisplay}</span>
        </div>` : ''}
        ${deliveryDisplay ? `
        <div class="totals-row" style="color: #0369A1;">
          <span>Delivery Charges:</span>
          <span>+${deliveryDisplay}</span>
        </div>` : ''}
        <div class="totals-row grand">
          <span>Total / Grand Total:</span>
          <span>Rs ${totalDisplay.replace(/[^0-9,]/g, '') || totalDisplay}</span>
        </div>
      </div>
    </div>

    <div style="font-size: 10px; color: #555; margin-bottom: 10px;">
      <strong>Notes:</strong> Online Payment Only.
    </div>

    <div class="bank-box">
      <div class="bank-title">
        <span>Official Bank Details</span>
        <span>HBL</span>
      </div>
      <div class="bank-grid">
        <div><span style="color: #666;">Account Title:</span> <strong>Fatima Ahsan</strong></div>
        <div><span style="color: #666;">Bank:</span> <strong>HBL (Habib Bank Limited)</strong></div>
        <div><span style="color: #666;">Account #:</span> <strong style="font-family: monospace;">50097918251603</strong></div>
        <div><span style="color: #666;">IBAN:</span> <strong style="font-family: monospace;">PK33HABB0050097918251603</strong></div>
        <div><span style="color: #666;">City:</span> Lahore</div>
        <div><span style="color: #666;">Country:</span> Pakistan</div>
      </div>
    </div>

    <div class="terms-box">
      <div class="terms-title">Terms & Conditions</div>
      <ul>
        <li>50% Advance to be paid before Production, 50% after production (before delivery)</li>
        <li>Delivery Charges will be included at the end of the order, depending on the weight and mode of delivery</li>
        <li>We own the rights to post and market the products designed & created by us.</li>
        <li>Advance Payment is NON REFUNDABLE.</li>
      </ul>
    </div>

    <div class="footer-note">
      Thank you for choosing The Paper Story. Crafted with love to be remembered forever.
    </div>
  </div>
</body>
</html>`

  let iframe = document.getElementById('tps-print-iframe')
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = 'tps-print-iframe'
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0px'
    iframe.style.height = '0px'
    iframe.style.border = 'none'
    document.body.appendChild(iframe)
  }

  const doc = iframe.contentWindow.document
  doc.open()
  doc.write(html)
  doc.close()

  iframe.contentWindow.focus()
  setTimeout(() => {
    iframe.contentWindow.print()
  }, 350)
}

export default function InvoiceModal({ order, onClose }) {
  const [copiedField, setCopiedField] = useState(null)
  const [copiedSummary, setCopiedSummary] = useState(false)

  if (!order) return null

  const orderNumber = order.number || order.orderNumber || order.id || 'TPS-INV'
  const customerName = order.customerName || order.name || 'Valued Client'
  const customerPhone = order.phone || ''
  const customerEmail = order.email || ''
  const customerAddress = order.shippingAddress || order.address || ''
  const customerCity = order.city || ''
  const notes = order.notes || ''
  const paymentStatus = order.paymentStatus || 'Advance Due (50%)'

  // Format order date
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB')

  // Parse items
  let items = []
  if (Array.isArray(order.items) && order.items.length > 0) {
    items = order.items
  } else if (order.productName) {
    items = [
      {
        productName: order.productName,
        quantity: order.quantity || 1,
        unitPrice: order.price || order.total || 'On Request',
        lineTotal: order.price || order.total || 'On Request',
      },
    ]
  } else {
    items = [
      {
        productName: 'Custom Bespoke Stationery Suite',
        quantity: 1,
        unitPrice: order.total || 'On Request',
        lineTotal: order.total || 'On Request',
      },
    ]
  }

  // Calculate totals
  const totalDisplay = order.total || order.price || 'On Request'
  const subtotalDisplay = order.subtotal || totalDisplay
  const discountDisplay = order.discount
    ? (String(order.discount).trim().startsWith('PKR') ? order.discount : `PKR ${order.discount}`)
    : null
  const rawDelivery = order.deliveryCharges || order.delivery || order.shippingFee || order.shipping
  const deliveryDisplay = rawDelivery
    ? (String(rawDelivery).trim().startsWith('PKR') ? String(rawDelivery).trim() : `PKR ${String(rawDelivery).trim()}`)
    : null

  const [isDownloading, setIsDownloading] = useState(false)

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handlePrint = () => {
    printInvoiceDocument(order)
  }

  const handleDownloadPdf = async () => {
    const card = document.getElementById('tps-invoice-card')
    if (!card) return
    setIsDownloading(true)
    try {
      const opt = {
        margin: [8, 10, 8, 10],
        filename: `The-Paper-Story-Invoice-${orderNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }
      await html2pdf().set(opt).from(card).save()
    } catch (err) {
      console.error('PDF generation error:', err)
      printInvoiceDocument(order)
    } finally {
      setIsDownloading(false)
    }
  }

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map((it) => `• ${it.productName} (Qty: ${it.quantity}) - ${it.lineTotal || it.unitPrice || ''}`)
      .join('\n')

    const discountLine = discountDisplay ? `\n*Discount:* -${discountDisplay}` : ''
    const deliveryLine = deliveryDisplay ? `\n*Delivery Charges:* +${deliveryDisplay}` : ''

    return `🌸 *The Paper Story — Official Order Invoice* 🌸
Hello *${customerName}*,

Thank you for trusting The Paper Story with your celebration! Here are the details of your bespoke order:

*Invoice #:* ${orderNumber}
*Date:* ${orderDate}

*Ordered Items:*
${itemsList}

*Subtotal:* ${subtotalDisplay}${discountLine}${deliveryLine}
*Grand Total:* ${totalDisplay}
*Payment Note:* Online Payment Only

🏦 *Bank Transfer Details:*
• *Bank:* ${BANK_DETAILS.bank}
• *Account Title:* ${BANK_DETAILS.name}
• *Account #:* ${BANK_DETAILS.accountNumber}
• *IBAN:* ${BANK_DETAILS.iban}
• *City / Country:* ${BANK_DETAILS.city}, ${BANK_DETAILS.country}

📜 *Terms & Conditions:*
1. 50% Advance to be paid before production, 50% after production (before delivery).
2. Delivery Charges will be included at the end of the order, depending on weight and mode of delivery.
3. We own the rights to post and market the products designed & created by us.
4. Advance payment is NON REFUNDABLE.

Kindly share a screenshot or receipt of the advance transfer once completed so our team can commence crafting your bespoke order. Thank you! ✨`
  }

  const handleWhatsAppSend = () => {
    const rawPhone = customerPhone.replace(/[^0-9]/g, '')
    // Default to +92 format if starts with 0
    let cleanPhone = rawPhone
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.slice(1)
    }
    const message = encodeURIComponent(generateWhatsAppMessage())
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${message}` : `https://wa.me/?text=${message}`
    window.open(url, '_blank')
  }

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage())
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2500)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return createPortal(
    <div
      style={{ zIndex: 99999 }}
      className="fixed inset-0 flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-6 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      {/* Print-only CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #tps-invoice-card, #tps-invoice-card * {
            visibility: visible !important;
          }
          #tps-invoice-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
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

      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl my-auto flex flex-col max-h-[94vh] rounded-2xl bg-white shadow-2xl overflow-hidden border border-paperstory-maroon/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden in Print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#FAF6F0] border-b border-paperstory-maroon/15">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paperstory-maroon text-white text-xs font-bold">
              TPS
            </span>
            <span className="font-serif text-sm sm:text-base font-semibold text-paperstory-ink">
              Official Invoice — {orderNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Separate Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-paperstory-maroon px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-paperstory-maroon-deep active:scale-95 disabled:opacity-60 cursor-pointer"
              title="Download Invoice as PDF"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{isDownloading ? 'Generating PDF...' : 'Download Invoice'}</span>
            </button>

            {/* Separate Print Invoice Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-paperstory-maroon/40 bg-white px-3 py-1.5 text-xs font-semibold text-paperstory-maroon shadow-xs transition hover:bg-[#FAF6F0] active:scale-95 cursor-pointer"
              title="Print Invoice directly"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Print Invoice</span>
            </button>

            {/* Send via WhatsApp Button */}
            <button
              onClick={handleWhatsAppSend}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#20ba59] active:scale-95 cursor-pointer"
              title="Send to Customer on WhatsApp"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              <span>Send via WhatsApp</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              title="Copy Summary"
            >
              {copiedSummary ? '✓ Copied' : '📋 Copy'}
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold transition ml-1"
              aria-label="Close invoice"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
          <div id="tps-invoice-card" className="mx-auto max-w-2xl bg-white text-neutral-800">
            {/* Top Brand & Invoice Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-paperstory-maroon pb-5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="The Paper Story Logo"
                  className="h-12 w-12 rounded-full shadow-xs shrink-0"
                />
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
                  <span className="text-xs font-bold text-paperstory-maroon font-mono">{orderNumber}</span>
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

            {/* Bill To & Order Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-neutral-200">
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-paperstory-maroon/10">
                <span className="text-[10px] font-bold tracking-widest text-paperstory-maroon uppercase block mb-1">
                  Bill To
                </span>
                <p className="font-serif text-base font-bold text-neutral-900">
                  {customerName}
                </p>
                {customerPhone && (
                  <p className="text-xs text-neutral-700 mt-0.5">
                    <strong>Phone:</strong> {customerPhone}
                  </p>
                )}
                {customerEmail && (
                  <p className="text-xs text-neutral-700 mt-0.5">
                    <strong>Email:</strong> {customerEmail}
                  </p>
                )}
                {customerAddress && (
                  <p className="text-xs text-neutral-600 mt-1 whitespace-pre-line leading-relaxed">
                    <strong>Address:</strong> {customerAddress}
                    {customerCity ? `, ${customerCity}` : ''}
                  </p>
                )}
              </div>

              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-paperstory-maroon/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-paperstory-maroon uppercase block mb-1">
                    Order Status & Payment
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block rounded-full bg-paperstory-maroon/10 border border-paperstory-maroon/20 px-2.5 py-0.5 text-xs font-semibold text-paperstory-maroon">
                      {paymentStatus}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      ({order.paymentMethod || 'Online Bank Transfer'})
                    </span>
                  </div>
                </div>

                {notes && (
                  <div className="mt-2 text-xs text-neutral-600 italic bg-white/70 p-2 rounded border border-neutral-200">
                    <strong>Note:</strong> "{notes}"
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="py-5">
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
                        <td className="py-3 px-3 font-medium text-neutral-900">
                          {it.productName}
                        </td>
                        <td className="py-3 px-3 text-center text-neutral-700">
                          {it.quantity}
                        </td>
                        <td className="py-3 px-3 text-right text-neutral-700">
                          {it.unitPrice || it.lineTotal || totalDisplay}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-neutral-900">
                          {it.lineTotal || it.unitPrice || totalDisplay}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Subtotal, Discount & Total Box */}
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

            {/* Payment Notes */}
            <div className="text-xs text-neutral-600 mb-4">
              <strong>Notes:</strong> Online Payment Only.
            </div>

            {/* Bank Details Box (EXACT from screenshot) */}
            <div className="mb-5 rounded-xl border border-paperstory-maroon/25 bg-[#FAF6F0] p-4 text-xs">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-paperstory-maroon/15">
                <span className="font-bold text-paperstory-maroon uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  Official Bank Details
                </span>
                <span className="text-[10px] text-paperstory-maroon font-semibold bg-white px-2 py-0.5 rounded border border-paperstory-maroon/20">
                  HBL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-800">
                <div>
                  <span className="text-neutral-500 font-medium">Account Title:</span>{' '}
                  <strong className="text-neutral-900">{BANK_DETAILS.name}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium">Bank:</span>{' '}
                  <strong className="text-neutral-900">{BANK_DETAILS.bank}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-medium">Account Number:</span>{' '}
                  <strong className="font-mono text-neutral-900">{BANK_DETAILS.accountNumber}</strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(BANK_DETAILS.accountNumber, 'acc')}
                    className="no-print text-[10px] text-paperstory-maroon hover:underline font-semibold"
                  >
                    {copiedField === 'acc' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-medium">IBAN:</span>{' '}
                  <strong className="font-mono text-neutral-900 text-[11px]">{BANK_DETAILS.iban}</strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(BANK_DETAILS.iban, 'iban')}
                    className="no-print text-[10px] text-paperstory-maroon hover:underline font-semibold"
                  >
                    {copiedField === 'iban' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium">City:</span>{' '}
                  <span>{BANK_DETAILS.city}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium">Country:</span>{' '}
                  <span>{BANK_DETAILS.country}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions (EXACT from screenshot) */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 text-xs text-neutral-700">
              <span className="font-bold text-neutral-900 uppercase tracking-wider text-[11px] block mb-2">
                Terms & Conditions
              </span>
              <ul className="space-y-1 leading-relaxed text-neutral-600 text-[11px]">
                {TERMS_AND_CONDITIONS.map((term, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-paperstory-maroon font-bold select-none">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Sign-off */}
            <div className="mt-6 pt-4 border-t border-neutral-200 text-center text-[11px] text-neutral-500 font-serif italic">
              Thank you for choosing The Paper Story. Crafted with love to be remembered forever.
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden in Print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#FAF6F0] border-t border-paperstory-maroon/15">
          <p className="text-xs text-neutral-500">
            Send directly to customer via WhatsApp or download as high-res PDF.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppSend}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#20ba59]"
            >
              Send to Customer on WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-paperstory-maroon px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-paperstory-maroon-deep"
            >
              Download PDF / Print
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}


import { useState } from 'react'
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp'
import { canPlaceOrder } from '../data/site'
import OrderModal from './OrderModal'
import InquiryModal from './InquiryModal'

export default function ProductCard({ product }) {
  const [tapped, setTapped] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const showOverlay = tapped
  const whatsappUrl = buildWhatsAppUrl(buildProductWhatsAppMessage(product))
  const showPrice = product.showPrice && product.price
  const isCod = product.paymentType === 'cod'
  const orderable = canPlaceOrder(product)

  return (
    <>
      <article className="cute-card group flex flex-col overflow-hidden p-3">
        <div
          className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-paperstory-blush/30"
          onClick={() => setTapped(!tapped)}
          onKeyDown={(e) => e.key === 'Enter' && setTapped(!tapped)}
          role="button"
          tabIndex={0}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-110"
          />
          <div
            className={`absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-300 ${
              showOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <span className="text-sm font-medium text-white">View Details</span>
          </div>
        </div>

        <span className="mb-2 inline-block w-fit rounded-full bg-paperstory-blush px-3 py-1 text-xs font-medium text-paperstory-maroon">
          {product.category}
        </span>

        <h3 className="mb-1 font-serif text-lg font-semibold text-paperstory-ink transition-colors group-hover:text-paperstory-maroon">
          {product.name}
        </h3>

        {showPrice ? (
          <p className="mb-2 text-sm font-semibold text-paperstory-maroon">{product.price}</p>
        ) : (
          <p className="mb-2 text-xs font-medium text-paperstory-ink/65">Price on request</p>
        )}

        {showPrice && (
          <p className="mb-4 text-xs font-medium text-paperstory-ink/70">
            {isCod ? 'COD available (Pakistan)' : 'Advance payment'}
          </p>
        )}

        <div className={`mt-auto flex flex-col gap-2 ${!showPrice ? 'mt-4' : ''}`}>
          {orderable && (
            <button
              type="button"
              onClick={() => setOrderOpen(true)}
              className="cute-btn-primary w-full"
            >
              Place order
            </button>
          )}
          {!orderable && (
            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="cute-btn-primary w-full"
            >
              Request custom order
            </button>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2.5 text-center text-xs font-semibold tracking-wide uppercase sm:text-sm ${
              orderable ? 'cute-btn-secondary' : 'gradient-btn text-white'
            }`}
          >
            Inquire on WhatsApp
          </a>
        </div>
      </article>

      {orderOpen && <OrderModal product={product} onClose={() => setOrderOpen(false)} />}
      {inquiryOpen && <InquiryModal product={product} onClose={() => setInquiryOpen(false)} />}
    </>
  )
}

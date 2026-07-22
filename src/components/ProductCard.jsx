import { useRef, useState } from 'react'
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp'
import { canPlaceOrder } from '../data/site'
import OrderModal from './OrderModal'
import InquiryModal from './InquiryModal'

const SWIPE_THRESHOLD_PX = 40

function isVideoSrc(src = '') {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src)
}

function ProductMedia({ product }) {
  const gallery = product.images?.length ? product.images : [product.image]
  const [index, setIndex] = useState(0)
  const current = gallery[index] || product.image
  const mediaIsVideo = isVideoSrc(current)
  const hasGallery = gallery.length > 1
  const externalUrl = product.externalUrl

  const pointerIdRef = useRef(null)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const swipingRef = useRef(false)
  const lockedAxisRef = useRef(null)

  const goTo = (next) => setIndex((next + gallery.length) % gallery.length)

  const onPointerDown = (event) => {
    if (!hasGallery) return
    if (event.button != null && event.button !== 0) return
    if (event.target.closest?.('button')) return

    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    startYRef.current = event.clientY
    swipingRef.current = false
    lockedAxisRef.current = null
  }

  const onPointerMove = (event) => {
    if (!hasGallery || pointerIdRef.current !== event.pointerId) return

    const dx = event.clientX - startXRef.current
    const dy = event.clientY - startYRef.current

    if (!lockedAxisRef.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      lockedAxisRef.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }

    if (lockedAxisRef.current === 'x') {
      swipingRef.current = true
      event.preventDefault()
    }
  }

  const onPointerUp = (event) => {
    if (!hasGallery || pointerIdRef.current !== event.pointerId) return

    const dx = event.clientX - startXRef.current
    const didSwipe = lockedAxisRef.current === 'x' && Math.abs(dx) >= SWIPE_THRESHOLD_PX

    pointerIdRef.current = null
    lockedAxisRef.current = null

    if (didSwipe) {
      goTo(dx < 0 ? index + 1 : index - 1)
    }
  }

  const media = mediaIsVideo ? (
    <video
      key={current}
      src={current}
      className="pointer-events-none h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={product.name}
    />
  ) : (
    <img
      key={current}
      src={current}
      alt={product.name}
      loading="lazy"
      draggable={false}
      className="pointer-events-none h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-105"
    />
  )

  return (
    <div
      className={`relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-paperstory-blush/30${hasGallery ? ' touch-pan-y' : ''}`}
      style={hasGallery ? { touchAction: 'pan-y' } : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full"
          aria-label={`Open ${product.name} preview`}
          onClick={(event) => {
            if (swipingRef.current) {
              event.preventDefault()
              swipingRef.current = false
            }
          }}
        >
          {media}
        </a>
      ) : (
        media
      )}

      {hasGallery && (
        <>
          <button
            type="button"
            className="absolute top-1/2 left-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-paperstory-maroon shadow"
            onClick={(e) => {
              e.stopPropagation()
              goTo(index - 1)
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute top-1/2 right-2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-paperstory-maroon shadow"
            onClick={(e) => {
              e.stopPropagation()
              goTo(index + 1)
            }}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {gallery.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`h-1.5 rounded-full ${i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/55'}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex(i)
                }}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function ProductCard({ product }) {
  const [orderOpen, setOrderOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const whatsappUrl = buildWhatsAppUrl(buildProductWhatsAppMessage(product))
  const showPrice = product.showPrice && product.price
  const isCod = product.paymentType === 'cod'
  const orderable = canPlaceOrder(product)

  return (
    <>
      <article className="cute-card group flex flex-col overflow-hidden p-3">
        <ProductMedia product={product} />

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

        <p className="mb-4 text-xs font-medium text-paperstory-ink/70">
          {isCod
            ? 'COD available within Pakistan'
            : 'Advance payment required'}
        </p>

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

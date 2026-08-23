import { useEffect, useId, useRef, useState } from 'react'
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from '../utils/whatsapp'
import { canPlaceOrder } from '../data/site'
import OrderModal from './OrderModal'
import InquiryModal from './InquiryModal'
import ImageLightbox from './ImageLightbox'

const SWIPE_THRESHOLD_PX = 40
const EXPAND_EVENT = 'paperstory:product-card-expand'

function isVideoSrc(src = '') {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src)
}

const TAP_MOVE_THRESHOLD_PX = 10

function preloadMedia(src) {
  if (!src || isVideoSrc(src)) return
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

function ProductMedia({ product, onOpenLightbox }) {
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
  const movedRef = useRef(false)
  const lockedAxisRef = useRef(null)

  // Warm adjacent gallery frames so swipe feels instant
  useEffect(() => {
    if (!hasGallery) return
    const prev = gallery[(index - 1 + gallery.length) % gallery.length]
    const next = gallery[(index + 1) % gallery.length]
    preloadMedia(prev)
    preloadMedia(next)
  }, [gallery, hasGallery, index])

  const goTo = (next) => setIndex((next + gallery.length) % gallery.length)

  const onPointerDown = (event) => {
    if (event.button != null && event.button !== 0) return
    if (event.target.closest?.('button')) return

    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    startYRef.current = event.clientY
    swipingRef.current = false
    movedRef.current = false
    lockedAxisRef.current = null
  }

  const onPointerMove = (event) => {
    if (pointerIdRef.current !== event.pointerId) return

    const dx = event.clientX - startXRef.current
    const dy = event.clientY - startYRef.current

    if (Math.abs(dx) >= TAP_MOVE_THRESHOLD_PX || Math.abs(dy) >= TAP_MOVE_THRESHOLD_PX) {
      movedRef.current = true
    }

    if (!lockedAxisRef.current) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      lockedAxisRef.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }

    if (lockedAxisRef.current === 'x' && hasGallery) {
      swipingRef.current = true
      event.preventDefault()
    }
  }

  const onPointerUp = (event) => {
    if (pointerIdRef.current !== event.pointerId) return

    const dx = event.clientX - startXRef.current
    const dy = event.clientY - startYRef.current
    const didSwipe =
      hasGallery &&
      lockedAxisRef.current === 'x' &&
      Math.abs(dx) >= SWIPE_THRESHOLD_PX
    const wasScroll = lockedAxisRef.current === 'y' || Math.abs(dy) >= TAP_MOVE_THRESHOLD_PX
    const wasMoved = movedRef.current

    pointerIdRef.current = null
    lockedAxisRef.current = null
    movedRef.current = false

    if (didSwipe) {
      goTo(dx < 0 ? index + 1 : index - 1)
      swipingRef.current = false
      return
    }

    if (swipingRef.current || wasScroll || wasMoved) {
      swipingRef.current = false
      return
    }

    if (event.target.closest?.('button')) return

    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer')
      return
    }

    onOpenLightbox?.(index)
  }

  const onPointerCancel = () => {
    pointerIdRef.current = null
    lockedAxisRef.current = null
    swipingRef.current = false
    movedRef.current = false
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
      loading={index === 0 ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={index === 0 ? 'high' : 'auto'}
      draggable={false}
      className="pointer-events-none h-full w-full object-cover sm:transition-transform sm:duration-400 sm:ease-out sm:group-hover:scale-105"
    />
  )

  return (
    <div
      className={`relative mb-4 aspect-[4/5] cursor-zoom-in overflow-hidden rounded-xl bg-paperstory-blush/30${hasGallery ? ' touch-pan-y' : ''}`}
      style={{ touchAction: hasGallery ? 'pan-y' : 'manipulation' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name} larger`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (externalUrl) {
            window.open(externalUrl, '_blank', 'noopener,noreferrer')
          } else {
            onOpenLightbox?.(index)
          }
        }
      }}
    >
      {media}

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
            {gallery.length <= 7 ? (
              gallery.map((src, i) => (
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
              ))
            ) : (
              <span className="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white tabular-nums">
                {index + 1} / {gallery.length}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function ProductCard({ product }) {
  const reactId = useId()
  const cardId = reactId.replace(/:/g, '')
  const [expanded, setExpanded] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const whatsappUrl = buildWhatsAppUrl(buildProductWhatsAppMessage(product))
  const showPrice = product.showPrice && product.price
  const isCod = product.paymentType === 'cod'
  const orderable = canPlaceOrder(product)
  const orderOnline = Boolean(product.orderOnline)
  const gallery = product.images?.length ? product.images : [product.image]

  useEffect(() => {
    const onExpand = (event) => {
      if (event.detail !== cardId) setExpanded(false)
    }
    window.addEventListener(EXPAND_EVENT, onExpand)
    return () => window.removeEventListener(EXPAND_EVENT, onExpand)
  }, [cardId])

  const setExpandedExclusive = (next) => {
    setExpanded(next)
    if (next) {
      window.dispatchEvent(new CustomEvent(EXPAND_EVENT, { detail: cardId }))
    }
  }

  const toggleExpanded = () => setExpandedExclusive(!expanded)

  return (
    <>
      <article
        className={`cute-card group flex flex-col overflow-hidden p-3 transition-[box-shadow] duration-200 ${
          expanded ? 'ring-1 ring-paperstory-maroon/25' : ''
        }`}
      >
        <ProductMedia
          product={product}
          onOpenLightbox={(startIndex) => {
            setLightboxIndex(startIndex)
            setLightboxOpen(true)
          }}
        />

        <button
          type="button"
          className="w-full cursor-pointer rounded-lg border-0 bg-transparent p-0 text-left"
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-controls={`product-ctas-${cardId}`}
        >
          <span className="mb-2 inline-block w-fit rounded-full bg-paperstory-blush px-3 py-1 text-xs font-medium text-paperstory-maroon">
            {product.category}
          </span>

          <h3 className="mb-1 font-serif text-lg font-semibold text-paperstory-ink transition-colors group-hover:text-paperstory-maroon">
            {product.name}
          </h3>

          {showPrice ? (
            <>
              <p className="mb-1 text-sm font-semibold text-paperstory-maroon">{product.price}</p>
              {product.priceNote && (
                <p className="mb-2 text-xs font-medium text-paperstory-maroon/85">{product.priceNote}</p>
              )}
            </>
          ) : (
            <p className="mb-2 text-xs font-medium text-paperstory-ink/65">Price on request</p>
          )}

          <p className="mb-3 text-xs font-medium text-paperstory-ink/70">
            {orderOnline
              ? 'Order on website · Pay online · Free delivery'
              : isCod
                ? 'COD available within Pakistan'
                : 'Advance payment required'}
          </p>

          {!expanded && (
            <span className="inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-paperstory-maroon/25 bg-paperstory-wash/80 px-4 py-2 text-xs font-semibold tracking-wide text-paperstory-maroon uppercase transition-colors hover:border-paperstory-maroon/45 hover:bg-paperstory-blush/60">
              Order options
            </span>
          )}
        </button>

        {expanded && (
          <div
            id={`product-ctas-${cardId}`}
            className="mt-auto flex flex-col gap-2"
          >
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
            <button
              type="button"
              onClick={() => setExpandedExclusive(false)}
              className="py-1 text-center text-xs font-medium text-paperstory-ink/55 underline-offset-2 hover:text-paperstory-maroon hover:underline"
            >
              Hide options
            </button>
          </div>
        )}
      </article>

      {orderOpen && <OrderModal product={product} onClose={() => setOrderOpen(false)} />}
      {inquiryOpen && <InquiryModal product={product} onClose={() => setInquiryOpen(false)} />}
      {lightboxOpen && (
        <ImageLightbox
          sources={gallery}
          startIndex={lightboxIndex}
          title={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}

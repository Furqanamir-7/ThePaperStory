import React, { useState, useRef, useEffect } from 'react'
import { useInView } from '../hooks/useInView'

const INSTAGRAM_URL = 'https://www.instagram.com/thepaperstory.co/'

const REAL_MOMENTS = [
  {
    id: 1,
    src: '/real-moments/moment-01.jpg',
    title: 'Custom Velvet Box Invitation',
    subtitle: 'Luxury bespoke wedding suite',
  },
  {
    id: 2,
    src: '/real-moments/moment-06.jpg',
    title: 'Custom Metallic Wax Seal',
    subtitle: 'Burgundy stamp with silk tassels',
  },
  {
    id: 3,
    src: '/real-moments/moment-03.jpg',
    title: 'Handcrafted Nikkahnama Ceremony',
    subtitle: 'Traditional calligraphy border',
  },
  {
    id: 4,
    src: '/real-moments/moment-05.jpg',
    title: 'Luxury Favour Gift Packaging',
    subtitle: 'Personalized monogram keepsake tins',
  },
  {
    id: 5,
    src: '/real-moments/moment-09.jpg',
    title: 'Gilded Floral Suite Flatlay',
    subtitle: 'Gold foil & handmade cotton paper',
  },
  {
    id: 7,
    src: '/real-moments/moment-02.jpg',
    title: 'Gilded Arch Wedding Invitation',
    subtitle: 'Hand-embossed gold floral suite',
  },
  {
    id: 8,
    src: '/real-moments/moment-11.jpg',
    title: 'Bridal Favour Hampers',
    subtitle: 'Personalized celebratory packaging',
  },
  {
    id: 9,
    src: '/real-moments/moment-13.jpg',
    title: 'Celebration Keepsake Suite',
    subtitle: 'Crafted to be cherished forever',
  },
  {
    id: 10,
    src: '/real-moments/moment-04.jpg',
    title: 'Bridal Stationery Collection',
    subtitle: 'Event cards & monogram inserts',
  },
  {
    id: 11,
    src: '/real-moments/moment-10.jpg',
    title: 'Emerald & Gold Suite',
    subtitle: 'Mughal arched borders',
  },
  {
    id: 12,
    src: '/real-moments/moment-07.jpg',
    title: 'Intricate Calligraphy Detail',
    subtitle: 'Bespoke Urdu script & floral artwork',
  },
  {
    id: 13,
    src: '/real-moments/moment-12.jpg',
    title: 'Deckled-Edge Cotton Invite',
    subtitle: 'Hand-torn vintage luxury paper',
  },
  {
    id: 14,
    src: '/real-moments/moment-08.jpg',
    title: 'Heirloom Nikkah Certificate',
    subtitle: 'Signed and framed celebration moment',
  },
]

export default function RealWeddings() {
  const [ref, isVisible] = useInView()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const handleScroll = (direction) => {
    if (!scrollRef.current) return
    const { clientWidth } = scrollRef.current
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : REAL_MOMENTS.length - 1))
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < REAL_MOMENTS.length - 1 ? prev + 1 : 0))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  const activePhoto = lightboxIndex !== null ? REAL_MOMENTS[lightboxIndex] : null

  // Pair moments into columns of 2 (Top and Bottom) for reliable multi-row layout
  const columns = []
  for (let i = 0; i < REAL_MOMENTS.length; i += 2) {
    columns.push({
      top: REAL_MOMENTS[i],
      topIndex: i,
      bottom: REAL_MOMENTS[i + 1] || null,
      bottomIndex: i + 1 < REAL_MOMENTS.length ? i + 1 : null,
    })
  }

  return (
    <section id="real-moments" className="bg-[#FAF7F2] py-12 sm:py-20 border-t border-paperstory-maroon/10">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        {/* Section Heading */}
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="heading-brand font-serif text-2xl font-semibold sm:text-4xl text-neutral-800 tracking-tight">
            Real Moments
          </h2>
        </div>

        {/* 2-Row Luxury Grid (5 Columns Visible on Desktop, with Left/Right Arrows) */}
        <div className="relative group/gallery">
          {/* Left Arrow Button */}
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white shadow-xl backdrop-blur-xs transition-all duration-300 hover:scale-105 active:scale-95 ${
              canScrollLeft ? 'opacity-90 hover:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Previous moments"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white shadow-xl backdrop-blur-xs transition-all duration-300 hover:scale-105 active:scale-95 ${
              canScrollRight ? 'opacity-90 hover:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Next moments"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Column-paired Flex Container */}
          <div
            ref={scrollRef}
            className="flex gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-1"
          >
            {columns.map((col, cIdx) => (
              <div
                key={cIdx}
                className="flex flex-col gap-2 sm:gap-2.5 shrink-0 snap-start w-[calc((100vw-36px)/2)] sm:w-[calc((100%-16px)/3)] md:w-[calc((100%-24px)/4)] lg:w-[calc((100%-32px)/5)]"
              >
                {/* Top Item */}
                {col.top && (
                  <div
                    onClick={() => setLightboxIndex(col.topIndex)}
                    className="group relative aspect-square w-full overflow-hidden rounded-md sm:rounded-lg bg-neutral-100 border border-paperstory-maroon/10 shadow-xs cursor-pointer transition-all duration-300 hover:shadow-lg"
                  >
                    <img
                      src={col.top.src}
                      alt={col.top.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    />

                    {/* Subtle Luxury Hover Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-2.5 sm:p-3 text-white">
                      <div className="mb-auto pt-1 flex justify-end">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-paperstory-maroon shadow-xs backdrop-blur-xs">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="font-serif text-xs sm:text-sm font-medium leading-tight text-white drop-shadow-sm line-clamp-1">
                        {col.top.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 mt-0.5">
                        {col.top.subtitle}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bottom Item */}
                {col.bottom && (
                  <div
                    onClick={() => setLightboxIndex(col.bottomIndex)}
                    className="group relative aspect-square w-full overflow-hidden rounded-md sm:rounded-lg bg-neutral-100 border border-paperstory-maroon/10 shadow-xs cursor-pointer transition-all duration-300 hover:shadow-lg"
                  >
                    <img
                      src={col.bottom.src}
                      alt={col.bottom.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    />

                    {/* Subtle Luxury Hover Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-2.5 sm:p-3 text-white">
                      <div className="mb-auto pt-1 flex justify-end">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-paperstory-maroon shadow-xs backdrop-blur-xs">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="font-serif text-xs sm:text-sm font-medium leading-tight text-white drop-shadow-sm line-clamp-1">
                        {col.bottom.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 mt-0.5">
                        {col.bottom.subtitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Tagline / CTA */}
        <div className="mt-6 sm:mt-10 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paperstory-maroon/25 bg-white px-5 py-2 text-xs font-semibold tracking-wider text-paperstory-maroon shadow-xs transition-all hover:bg-paperstory-maroon hover:text-white hover:shadow-md"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Follow @thepaperstory.co on Instagram
          </a>
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Lightbox Container */}
          <div
            className="relative flex flex-col max-h-[92vh] max-w-[95vw] sm:max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Counter and Close Button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
              <span className="text-xs font-semibold tracking-wider text-paperstory-maroon uppercase">
                Real Celebration ? {lightboxIndex + 1} of {REAL_MOMENTS.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Photo with Navigation Controls */}
            <div className="relative flex-1 bg-neutral-950 flex items-center justify-center min-h-[300px] sm:min-h-[420px] max-h-[70vh] overflow-hidden">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="max-h-[70vh] w-full object-contain select-none"
              />

              {/* Prev Button in Lightbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((prev) => (prev > 0 ? prev - 1 : REAL_MOMENTS.length - 1))
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-xs transition"
                aria-label="Previous photo"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Next Button in Lightbox */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((prev) => (prev < REAL_MOMENTS.length - 1 ? prev + 1 : 0))
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-xs transition"
                aria-label="Next photo"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-paperstory-ink">
                  {activePhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-paperstory-ink/70">
                  {activePhoto.subtitle}
                </p>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-paperstory-maroon hover:underline"
              >
                View on Instagram &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

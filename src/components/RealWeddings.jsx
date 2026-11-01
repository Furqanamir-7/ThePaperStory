import React, { useState } from 'react'
import { useInView } from '../hooks/useInView'

const REAL_MOMENTS = [
  {
    src: '/real-moments/moment-01.jpg',
    title: 'Custom Velvet Box Invitation',
    subtitle: 'Luxury bespoke wedding suite',
    span: 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-2',
    aspect: 'aspect-[4/5]',
  },
  {
    src: '/real-moments/moment-09.jpg',
    title: 'Gilded Floral Suite Flatlay',
    subtitle: 'Gold foil & handmade cotton paper',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-2',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/real-moments/moment-03.jpg',
    title: 'Handcrafted Nikkahnama Ceremony',
    subtitle: 'Traditional calligraphy border',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1',
    aspect: 'aspect-square',
  },
  {
    src: '/real-moments/moment-04.jpg',
    title: 'Bridal Stationery Collection',
    subtitle: 'Event cards & monogram inserts',
    span: 'col-span-1 sm:col-span-2 lg:col-span-1',
    aspect: 'aspect-square',
  },
  {
    src: '/real-moments/moment-06.jpg',
    title: 'Custom Metallic Wax Seal',
    subtitle: 'Burgundy stamp with silk tassels',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-2',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/real-moments/moment-08.jpg',
    title: 'Heirloom Nikkah Certificate',
    subtitle: 'Signed and framed celebration moment',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-2',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/real-moments/moment-05.jpg',
    title: 'Luxury Favour Gift Packaging',
    subtitle: 'Personalized monogram round tins',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1',
    aspect: 'aspect-square',
  },
  {
    src: '/real-moments/moment-10.jpg',
    title: 'Emerald & Gold Suite',
    subtitle: 'Mughal arched borders',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1',
    aspect: 'aspect-square',
  },
  {
    src: '/real-moments/moment-12.jpg',
    title: 'Deckled-Edge Cotton Invite',
    subtitle: 'Hand-torn vintage luxury paper',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1',
    aspect: 'aspect-square',
  },
  {
    src: '/real-moments/moment-13.jpg',
    title: 'Celebration Moments',
    subtitle: 'Loved by couples across Pakistan & overseas',
    span: 'col-span-1 sm:col-span-2 lg:col-span-2',
    aspect: 'aspect-[16/10]',
  },
  {
    src: '/real-moments/moment-07.jpg',
    title: 'Intricate Calligraphy Detail',
    subtitle: 'Bespoke Urdu script & floral artwork',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1',
    aspect: 'aspect-square',
  },
  {
    src: '/real-moments/moment-11.jpg',
    title: 'Bridal Favour Hampers',
    subtitle: 'Personalized celebratory packaging',
    span: 'col-span-1 sm:col-span-1 lg:col-span-1',
    aspect: 'aspect-square',
  },
]

export default function RealWeddings() {
  const [ref, isVisible] = useInView()
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  return (
    <section id="real-moments" className="bg-[#FAF7F2] py-12 sm:py-20 border-t border-paperstory-maroon/10">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        {/* Section Heading */}
        <div className="mb-8 text-center sm:mb-14">
          <p className="mb-2 text-xs font-semibold tracking-[0.28em] text-paperstory-maroon/75 uppercase sm:mb-3">
            Real Moments
          </p>
          <h2 className="heading-brand mb-3 text-2xl font-semibold sm:text-4xl text-paperstory-ink">
            Loved in Real Celebrations
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-paperstory-ink/75 sm:text-base font-serif italic">
            Authentic moments captured by our couples & clients — real wedding suites, Nikkah certificates, and keepsake favors crafted to be remembered forever.
          </p>
        </div>

        {/* Still Luxury Collage Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 auto-rows-auto">
          {REAL_MOMENTS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(item)}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-paperstory-maroon/10 shadow-[0_4px_20px_rgba(43,27,31,0.04)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(163,30,59,0.14)] hover:-translate-y-0.5 cursor-pointer ${item.span}`}
            >
              <div className={`w-full h-full min-h-[160px] sm:min-h-[200px] overflow-hidden`}>
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Elegant Caption Overlay on Hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-3 sm:p-4 text-white">
                <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-rose-200 uppercase">
                  Real Celebration
                </span>
                <h3 className="font-serif text-sm sm:text-base font-medium leading-tight text-white drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/80 line-clamp-1 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Tagline */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-paperstory-ink/65 tracking-wide">
            Tag us in your special moments on Instagram{' '}
            <a
              href="https://www.instagram.com/thepaperstory.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-paperstory-maroon hover:underline"
            >
              @thepaperstory.co
            </a>
          </p>
        </div>
      </div>

      {/* Lightbox Modal for Full View */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] sm:max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition hover:bg-black"
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="max-h-[75vh] w-full object-contain bg-neutral-900"
            />
            <div className="p-4 sm:p-5 bg-white">
              <span className="text-xs font-semibold tracking-widest text-paperstory-maroon uppercase">
                The Paper Story ? Client Celebration
              </span>
              <h3 className="mt-1 font-serif text-lg font-semibold text-paperstory-ink">
                {selectedPhoto.title}
              </h3>
              <p className="text-sm text-paperstory-ink/70 mt-0.5">
                {selectedPhoto.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

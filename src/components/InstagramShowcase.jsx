import { useInView } from '../hooks/useInView'

const INSTAGRAM_URL = 'https://www.instagram.com/thepaperstory.co/'

// 36 curated Instagram photos from official showcase
const INSTA_IMAGES = Array.from({ length: 36 }, (_, i) => `/instagram/insta-${String(i + 1).padStart(2, '0')}.jpg`)

function InstaCard({ src, index }) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="insta-slide-card group relative block cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      title="View on Instagram @thepaperstory.co"
    >
      <img
        src={src}
        alt={`The Paper Story Instagram moment ${index + 1}`}
        loading="lazy"
        className="w-full h-auto block object-cover"
      />
      {/* Subtle Instagram hover pill */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-paperstory-maroon/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold tracking-wider text-paperstory-maroon shadow-md">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          @thepaperstory.co
        </span>
      </div>
    </a>
  )
}

function InstaMarqueeColumn({ images, reverse = false }) {
  const loop = [...images, ...images]
  return (
    <div className={`insta-marquee${reverse ? ' insta-marquee--reverse' : ''}`}>
      <div className="insta-marquee-track">
        {loop.map((src, i) => (
          <InstaCard key={`${src}-${i}`} src={src} index={i % images.length} />
        ))}
      </div>
    </div>
  )
}

function InstaMarqueeRow({ images }) {
  const loop = [...images, ...images]
  return (
    <div className="insta-marquee insta-marquee--row">
      <div className="insta-marquee-track">
        {loop.map((src, i) => (
          <InstaCard key={`${src}-${i}`} src={src} index={i % images.length} />
        ))}
      </div>
    </div>
  )
}

export default function InstagramShowcase() {
  const [ref, isVisible] = useInView()

  // 4 columns of 9 images each for a rich, varied vertical cascade
  const cols = [
    INSTA_IMAGES.slice(0, 9),
    INSTA_IMAGES.slice(9, 18),
    INSTA_IMAGES.slice(18, 27),
    INSTA_IMAGES.slice(27, 36),
  ]

  return (
    <section className="bg-paperstory-cream py-8 sm:py-16 overflow-hidden border-t border-paperstory-maroon/10">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="mb-6 text-center sm:mb-10">
          <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-paperstory-maroon uppercase">
            Live from our Studio
          </p>
          <h2 className="heading-brand mb-2 text-2xl font-semibold sm:mb-3 sm:text-4xl">
            Follow Us on Instagram
          </h2>
          <p className="mx-auto max-w-xl text-sm text-gray-600 sm:text-base">
            Behind the scenes of handcrafted invitations, wax seals, luxury calligraphy & bespoke bridal stationery.
          </p>
          <div className="mt-4 flex justify-center">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-paperstory-maroon/30 bg-white px-5 py-2 text-xs font-semibold tracking-wider text-paperstory-maroon shadow-xs transition-all hover:bg-paperstory-maroon hover:text-white hover:shadow-md"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Follow @thepaperstory.co
            </a>
          </div>
        </div>

        {/* Mobile Horizontal Carousel */}
        <div className="insta-slider-mobile lg:hidden">
          <InstaMarqueeRow images={INSTA_IMAGES} />
        </div>

        {/* Desktop 4-Column Vertical Cascade */}
        <div className="insta-slider-desktop hidden lg:grid lg:grid-cols-4 lg:gap-4">
          {cols.map((images, i) => (
            <InstaMarqueeColumn key={i} images={images} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}


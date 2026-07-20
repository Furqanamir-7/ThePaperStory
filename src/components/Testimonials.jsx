import { useInView } from '../hooks/useInView'

const REVIEW_IMAGES = Array.from({ length: 12 }, (_, i) => `/reviews/review-${i + 1}.jpeg`)

function ReviewCard({ src, index }) {
  return (
    <figure className="review-slide-card">
      <img
        src={src}
        alt={`Client review ${index + 1}`}
        loading="lazy"
        className="review-slide-img"
      />
    </figure>
  )
}

function ReviewMarqueeColumn({ images, reverse = false }) {
  const loop = [...images, ...images]
  return (
    <div className={`review-marquee${reverse ? ' review-marquee--reverse' : ''}`}>
      <div className="review-marquee-track">
        {loop.map((src, i) => (
          <ReviewCard key={`${src}-${i}`} src={src} index={i % images.length} />
        ))}
      </div>
    </div>
  )
}

function ReviewMarqueeRow({ images }) {
  const loop = [...images, ...images]
  return (
    <div className="review-marquee review-marquee--row">
      <div className="review-marquee-track">
        {loop.map((src, i) => (
          <ReviewCard key={`${src}-${i}`} src={src} index={i % images.length} />
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [ref, isVisible] = useInView()
  const cols = [
    REVIEW_IMAGES.slice(0, 3),
    REVIEW_IMAGES.slice(3, 6),
    REVIEW_IMAGES.slice(6, 9),
    REVIEW_IMAGES.slice(9, 12),
  ]

  return (
    <section className="bg-paperstory-cream py-5 sm:py-16">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="mb-5 text-center sm:mb-10">
          <h2 className="heading-brand mb-2 text-2xl font-semibold sm:mb-3 sm:text-4xl">
            Loved by Our Clients
          </h2>
          <p className="text-sm text-gray-600 sm:text-base">
            Real reviews from clients who trusted us with their celebrations.
          </p>
        </div>

        <div className="review-slider-mobile lg:hidden">
          <ReviewMarqueeRow images={REVIEW_IMAGES} />
        </div>

        <div className="review-slider-desktop hidden lg:grid">
          {cols.map((images, i) => (
            <ReviewMarqueeColumn key={i} images={images} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

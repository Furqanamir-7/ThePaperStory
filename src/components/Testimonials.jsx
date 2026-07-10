import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'

const testimonials = [
  {
    quote: 'Our wedding invitations were absolutely stunning. Every guest commented on how beautiful they were!',
    name: 'Ayesha & Omar',
  },
  {
    quote: 'The custom packaging elevated our brand gifting to a whole new level. Truly premium quality.',
    name: 'Sana K.',
  },
  {
    quote: 'Quick responses on WhatsApp and flawless e-invites. Made our planning so much easier.',
    name: 'Fatima R.',
  },
  {
    quote: 'The Nikkah Certificate was hand-painted to perfection. A keepsake we will treasure forever.',
    name: 'Hina & Bilal',
  },
  {
    quote: 'Our favours looked so elegant — guests kept asking where we got them from!',
    name: 'Zainab M.',
  },
  {
    quote: 'Beautiful stationery, thoughtful details, and delivery right on time. Highly recommend.',
    name: 'Maryam A.',
  },
]

function useVisibleCount() {
  const [visible, setVisible] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches ? 3 : 1
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setVisible(mq.matches ? 3 : 1)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return visible
}

export default function Testimonials() {
  const [ref, isVisible] = useInView()
  const visibleCount = useVisibleCount()
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(testimonials.length / visibleCount)

  useEffect(() => {
    setPage(0)
  }, [visibleCount])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [pageCount])

  const goTo = (next) => {
    setPage((next + pageCount) % pageCount)
  }

  return (
    <section className="bg-paperstory-cream py-16 sm:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="mb-10 text-center">
          <h2 className="heading-brand mb-3 text-3xl font-semibold sm:text-4xl">
            Loved by Our Clients
          </h2>
          <p className="text-sm text-gray-600 sm:text-base">
            A glimpse into the moments we&apos;ve helped make unforgettable.
          </p>
        </div>

        <div className="testimonial-slider">
          <button
            type="button"
            className="testimonial-slider-btn"
            onClick={() => goTo(page - 1)}
            aria-label="Previous reviews"
          >
            ‹
          </button>

          <div className="testimonial-slider-viewport">
            <div
              className="testimonial-slider-track"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: pageCount }, (_, pageIndex) => (
                <div
                  key={pageIndex}
                  className={`testimonial-slider-page${visibleCount === 1 ? ' testimonial-slider-page--single' : ''}`}
                >
                  {testimonials
                    .slice(pageIndex * visibleCount, pageIndex * visibleCount + visibleCount)
                    .map((t) => (
                      <blockquote key={t.name} className="testimonial-card">
                        <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                        <footer className="testimonial-name">— {t.name}</footer>
                      </blockquote>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="testimonial-slider-btn"
            onClick={() => goTo(page + 1)}
            aria-label="Next reviews"
          >
            ›
          </button>
        </div>

        <div className="testimonial-slider-dots">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              className={`testimonial-slider-dot${index === page ? ' testimonial-slider-dot--active' : ''}`}
              onClick={() => setPage(index)}
              aria-label={`Go to review set ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

import { useInView } from '../hooks/useInView'
import { galleryImages } from '../data/products'

export default function Testimonials() {
  const [ref, isVisible] = useInView()

  return (
    <section className="bg-white py-16 sm:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-serif text-3xl font-semibold text-paperstory-maroon sm:text-4xl">
            Loved by Our Clients
          </h2>
          <p className="text-sm text-gray-600 sm:text-base">
            A glimpse into the moments we've helped make unforgettable.
          </p>
        </div>

        <div className="mb-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {galleryImages.map((src, i) => (
            <div
              key={i}
              className="h-36 w-36 shrink-0 overflow-hidden rounded-xl shadow-sm transition-transform hover:scale-105 sm:h-44 sm:w-44"
            >
              <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
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
          ].map((t) => (
            <blockquote
              key={t.name}
              className="rounded-2xl bg-paperstory-cream p-6 shadow-sm"
            >
              <p className="mb-4 font-serif text-lg leading-relaxed text-gray-700 italic">
                "{t.quote}"
              </p>
              <footer className="text-sm font-medium text-paperstory-maroon">— {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

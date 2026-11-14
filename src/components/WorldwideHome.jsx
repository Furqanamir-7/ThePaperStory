import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import { STORE_WHATSAPP } from '../data/site'

const WHATSAPP_SHIPPING_URL = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
  'Hi! I would like to get a quote and delivery estimate for shipping custom invitations to my city.'
)}`

const REGIONS = [
  { flag: '🇬🇧', name: 'United Kingdom', time: '7–10 days' },
  { flag: '🇺🇸', name: 'United States', time: '7–12 days' },
  { flag: '🇪🇺', name: 'Europe', time: '8–12 days' },
  { flag: '🇦🇪', name: 'UAE & Gulf', time: '4–7 days' },
  { flag: '🇨🇦', name: 'Canada', time: '8–14 days' },
  { flag: '🇦🇺', name: 'Australia', time: '8–14 days' },
  { flag: '🇵🇰', name: 'Pakistan', time: '2–4 days' },
]

export default function WorldwideHome() {
  const [ref, isVisible] = useInView()

  return (
    <section className="bg-paperstory-wash/60 py-12 sm:py-16 border-y border-paperstory-maroon/10">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paperstory-maroon/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-paperstory-maroon mb-3">
            <span>✈️</span>
            <span>Worldwide Delivery</span>
          </span>
          <h2 className="heading-brand font-serif text-2xl font-semibold sm:text-4xl text-paperstory-charcoal">
            We Ship Worldwide
          </h2>
          <p className="mt-2 text-sm sm:text-base text-paperstory-ink/75 leading-relaxed font-sans">
            Every piece is designed, printed, and packaged in our studio and delivered safely to couples and celebrations across the globe.
          </p>
        </div>

        {/* Regional Quick Times Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-8">
          {REGIONS.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl bg-white border border-paperstory-maroon/10 p-3.5 sm:p-4 text-center shadow-xs hover:border-paperstory-maroon/30 transition"
            >
              <div className="text-2xl mb-1.5">{r.flag}</div>
              <div className="font-serif font-semibold text-xs sm:text-sm text-paperstory-charcoal truncate">
                {r.name}
              </div>
              <div className="text-[11px] font-medium text-paperstory-maroon mt-0.5">
                {r.time}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-center">
          <Link
            to="/shipping"
            className="inline-flex items-center gap-2 rounded-full bg-paperstory-maroon px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-paperstory-maroon-deep transition"
          >
            <span>View Full Shipping Guide</span>
            <span>→</span>
          </Link>
          <a
            href={WHATSAPP_SHIPPING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paperstory-maroon/30 bg-white px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-paperstory-maroon hover:bg-paperstory-wash transition"
          >
            <span>Ask for Shipping Quote</span>
            <span>💬</span>
          </a>
        </div>
      </div>
    </section>
  )
}


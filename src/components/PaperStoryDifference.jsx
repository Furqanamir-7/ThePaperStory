import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import { STORE_WHATSAPP } from '../data/site'

const WHATSAPP_URL = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
  "Hi! I'd love help bringing my stationery vision to life."
)}`

const pillars = [
  {
    title: 'Premium quality',
    text: 'The finest papers, finishes, and printing techniques for every celebration.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="14" y="18" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14 26h36M22 18v-4h20v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M28 36l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 14l1.5 3.5L47 19l-3.5 1.5L42 24l-1.5-3.5L37 19l3.5-1.5L42 14z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Designed with care',
    text: 'Every piece is thoughtfully designed to hold emotion, memory, and meaning.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="28" cy="28" r="12" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="24" cy="24" r="2.2" fill="currentColor" />
        <circle cx="32" cy="24" r="2.2" fill="currentColor" />
        <circle cx="28" cy="32" r="2.2" fill="currentColor" />
        <path d="M38 38l10 10M45 51l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Easy customization',
    text: 'Personalize colours, fonts, wording, packaging, and finishes to match your story.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="12" y="14" width="32" height="26" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M18 22h20M18 28h16M18 34h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="38" y="34" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M42 40h6M42 44h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Personal support',
    text: 'Bring your vision to life with dedicated WhatsApp guidance from our team.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect x="18" y="10" width="22" height="38" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M26 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="29" cy="42" r="1.8" fill="currentColor" />
        <path d="M44 28c4 0 8 3 8 7 0 1.5-.5 2.8-1.3 3.9L52 44l-4.2-1.2c-.9.3-1.8.5-2.8.5-4 0-7-3-7-7s3-8 6-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    link: { href: WHATSAPP_URL, label: 'WhatsApp support' },
  },
]

export default function PaperStoryDifference() {
  const [ref, isVisible] = useInView()

  return (
    <section className="section-wash py-8 sm:py-16">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <h2 className="heading-brand mb-6 text-center text-2xl font-semibold sm:mb-12 sm:text-4xl">
          The Paper Story Difference
        </h2>

        <div className="difference-grid">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="difference-item">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center text-paperstory-maroon">
                <div className="h-14 w-14">{pillar.icon}</div>
              </div>
              <h3 className="mb-3 font-serif text-xl font-semibold italic text-paperstory-ink">
                {pillar.title}
              </h3>
              <p className="mx-auto max-w-[16rem] text-sm leading-relaxed text-paperstory-ink/70">
                {pillar.text}
                {pillar.link && (
                  <>
                    {' '}
                    <a
                      href={pillar.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-paperstory-maroon/40 underline-offset-2 transition-colors hover:text-paperstory-maroon hover:decoration-paperstory-maroon"
                    >
                      {pillar.link.label}
                    </a>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:mt-12">
          <Link to="/shop" className="text-sm font-semibold tracking-wide text-paperstory-maroon uppercase hover:underline">
            Explore the collection →
          </Link>
        </div>
      </div>
    </section>
  )
}

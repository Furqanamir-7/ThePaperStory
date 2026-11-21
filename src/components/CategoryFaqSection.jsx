import { useState } from 'react'
import { CATEGORY_FAQS } from '../utils/seo'

export default function CategoryFaqSection({ categorySlug, categoryName }) {
  const [openIndex, setOpenIndex] = useState(0)
  const faqs = CATEGORY_FAQS[categorySlug] || CATEGORY_FAQS['wedding-invitations']

  if (!faqs || faqs.length === 0) return null

  const waText = encodeURIComponent(
    `Hi The Paper Story! I am browsing your ${categoryName || 'collection'} and would like to ask a few questions about custom ordering, pricing, and turnaround.`
  )
  const waUrl = `https://wa.me/923144392928?text=${waText}`

  return (
    <section className="mt-12 mb-8 border-t border-paperstory-charcoal/10 pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-handwriting text-2xl text-paperstory-maroon block mb-1">
            Questions &amp; Details
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-paperstory-charcoal font-normal tracking-wide">
            Frequently Asked Questions — {categoryName}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-paperstory-charcoal/70 max-w-2xl mx-auto font-sans">
            Everything you need to know about custom design, paper stocks, turnaround times, and express worldwide delivery.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 mb-8">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-paperstory-charcoal/10 bg-white/70 backdrop-blur-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left font-serif text-base sm:text-lg text-paperstory-charcoal hover:text-paperstory-maroon transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{faq.q}</span>
                  <span
                    className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-paperstory-charcoal/20 text-xs transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-paperstory-maroon text-paperstory-cream border-transparent' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-0 sm:px-5 text-xs sm:text-sm text-paperstory-charcoal/80 leading-relaxed font-sans border-t border-paperstory-charcoal/5">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Studio Order Conversion Card */}
        <div className="rounded-2xl bg-gradient-to-br from-paperstory-maroon-deep to-paperstory-maroon p-6 sm:p-8 text-paperstory-cream shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs tracking-wider uppercase font-semibold mb-2">
              ✦ Handcrafted In Our Studio
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal">
              Have a Custom Vision for Your {categoryName}?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-paperstory-cream/85 max-w-xl">
              Collaborate one-on-one with Fatima and Huzaifa. We accommodate bespoke cardstocks, foil stamping, Urdu calligraphy, and urgent timelines.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-paperstory-maroon shadow hover:bg-paperstory-cream transition-all duration-200"
            >
              <span>💬 Enquire on WhatsApp</span>
              <span>→</span>
            </a>
            <span className="text-[11px] text-paperstory-cream/70 font-sans">
              Worldwide Tracked Courier (DHL / TCS)
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

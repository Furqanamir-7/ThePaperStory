import { useState } from 'react'
import { getCountrySeo } from '../utils/seo'
import { STORE_WHATSAPP } from '../data/site'

const WHATSAPP_FAQ_URL = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
  'Hi! I have a question about custom wedding invitations and international shipping.'
)}`

export default function FaqSection({ countryCode = null }) {
  const [openIndex, setOpenIndex] = useState(0)
  const info = getCountrySeo(countryCode)
  const countryName = info ? info.name : 'the USA, UK, UAE, Canada, Australia & Worldwide'
  const transit = info ? info.transitTime : '4–7 business days via DHL Express'

  const faqs = [
    {
      question: `Do you deliver custom wedding invitations to ${countryName}?`,
      answer: `Yes! We provide door-to-door tracked worldwide delivery via DHL Express and express international couriers. We frequently craft and deliver wedding stationery, Nikkah certificates, and bespoke suites to couples across ${countryName}. Standard shipping transit is typically ${transit}.`,
    },
    {
      question: 'How long does production take, and is it separate from courier delivery?',
      answer:
        'Yes, production time and shipping time are separate. Our standard production time is 20–30 working days to meticulously print, foil-stamp, hand-assemble, and quality-check each piece. Courier delivery takes an additional 4–7 business days depending on your destination. If you require your order earlier, please contact us before placing it — we accommodate urgent orders based on our studio schedule.',
    },
    {
      question: 'Can we customize languages, calligraphy (Urdu, Arabic, English), and colors?',
      answer:
        'Every design in our catalog is 100% customizable. You can customize wording in English, Urdu, Arabic, or bilingual layouts, choose your foil finishes (gold, rose gold, silver, bronze), select envelope liners, wax seal monograms, and silk ribbon shades to match your wedding palette.',
    },
    {
      question: 'What is the minimum order quantity for wedding stationery?',
      answer:
        'Our standard minimum order quantity is 25 pieces per design. For intimate events or special custom requirements, feel free to speak directly with Fatima and Huzaifa on WhatsApp for a personalized arrangement.',
    },
    {
      question: 'How do international customers place an order and submit payment?',
      answer:
        'Simply select your favorite design and tap "Enquire on WhatsApp". You will collaborate directly with our founders to finalize wording, design proofs, and paper selections. Before printing, you receive high-resolution digital proofs for final sign-off. We accept international payments seamlessly via secure bank transfer, credit/debit card, and international remittances.',
    },
  ]

  return (
    <section id="faqs" className="bg-paperstory-cream py-14 sm:py-20 border-t border-paperstory-maroon/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-paperstory-maroon/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-paperstory-maroon mb-3">
            <span>✨</span>
            <span>International Client Guide</span>
          </span>
          <h2 className="heading-brand font-serif text-2xl font-semibold sm:text-4xl text-paperstory-charcoal">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs sm:text-base text-paperstory-charcoal/70 max-w-xl mx-auto font-sans">
            Everything you need to know about bespoke stationery, custom calligraphy, and express international delivery.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-paperstory-maroon/15 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer transition hover:bg-paperstory-wash/30"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm sm:text-base font-semibold text-paperstory-charcoal pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`text-paperstory-maroon font-mono text-sm shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-[13px] text-paperstory-charcoal/80 leading-relaxed font-sans border-t border-paperstory-maroon/10">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-8 text-center bg-paperstory-wash/70 rounded-2xl p-4 sm:p-6 border border-paperstory-maroon/10">
          <p className="text-xs sm:text-sm text-paperstory-charcoal font-sans">
            Have a custom requirement or need an immediate delivery quote for your city?
          </p>
          <a
            href={WHATSAPP_FAQ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-paperstory-maroon hover:bg-paperstory-maroon-deep px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition"
          >
            <span>Ask us on WhatsApp</span>
            <span>💬</span>
          </a>
        </div>
      </div>
    </section>
  )
}


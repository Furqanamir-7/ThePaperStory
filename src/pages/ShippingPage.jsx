import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Seo from '../components/Seo'
import { SHIPPING, HOW_IT_WORKS_STEPS } from '../config/shipping'
import { STORE_WHATSAPP } from '../data/site'

const WHATSAPP_SHIPPING_URL = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
  'Hi Fatima & Huzaifa! I am an international client and would like an estimate/quote for shipping custom stationery to my location.'
)}`

const COUNTRY_ROWS = [
  { flag: '🇬🇧', country: 'United Kingdom', code: 'GB', ...SHIPPING.GB },
  { flag: '🇺🇸', country: 'United States', code: 'US', ...SHIPPING.US },
  { flag: '🇪🇺', country: 'Europe', code: 'EU', ...SHIPPING.EU },
  { flag: '🇦🇪', country: 'United Arab Emirates', code: 'AE', ...SHIPPING.AE },
  { flag: '🇨🇦', country: 'Canada', code: 'CA', ...SHIPPING.CA },
  { flag: '🇦🇺', country: 'Australia', code: 'AU', ...SHIPPING.AU },
  { flag: '🇵🇰', country: 'Pakistan (Domestic)', code: 'PK', ...SHIPPING.PK },
  { flag: '🌍', country: 'Rest of the World', code: 'Worldwide', ...SHIPPING.default },
]

export default function ShippingPage() {
  return (
    <>
      <Seo
        title="Worldwide Shipping & Custom Orders | The Paper Story"
        description="We ship custom wedding invitations, Nikkah certificates, and bespoke stationery worldwide to the UK, USA, UAE, Canada, Australia, and beyond. Tracked DHL/FedEx delivery."
        path="/shipping"
      />

      <PageHeader
        title="Worldwide Shipping & Delivery"
        subtitle="Artisanal stationery crafted in our studio and delivered to celebrations across the globe."
        breadcrumb="Home / Shipping"
      />

      <div className="bg-paperstory-cream py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Banner Notice */}
          <div className="rounded-2xl sm:rounded-3xl bg-paperstory-maroon text-white p-6 sm:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
                ✈️ Global Dispatch
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
                Yes, We Ship Worldwide
              </h2>
              <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
                Whether you are in London, New York, Dubai, Toronto, Sydney, or Karachi, every piece is designed, checked, and packed in our studio to reach you safely.
              </p>
            </div>
            <a
              href={WHATSAPP_SHIPPING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-paperstory-maroon shadow-sm hover:bg-paperstory-wash transition cursor-pointer"
            >
              <span>Get a Shipping Quote</span>
              <span>→</span>
            </a>
          </div>

          {/* Delivery Transit Times Table */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-paperstory-maroon">
                Estimated Delivery Transit Times
              </h2>
              <p className="mt-2 text-sm sm:text-base text-paperstory-ink/70">
                Transit times apply after studio production is completed and your parcel is dispatched.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-paperstory-maroon/15 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-paperstory-ink">
                  <thead className="bg-paperstory-wash/80 border-b border-paperstory-maroon/15 text-xs uppercase tracking-wider text-paperstory-maroon/80 font-semibold">
                    <tr>
                      <th scope="col" className="px-5 py-4">Destination</th>
                      <th scope="col" className="px-5 py-4">Transit Time</th>
                      <th scope="col" className="px-5 py-4">Primary Courier</th>
                      <th scope="col" className="px-5 py-4">Tracking & Coverage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-paperstory-maroon/10">
                    {COUNTRY_ROWS.map((row) => (
                      <tr key={row.country} className="hover:bg-paperstory-wash/30 transition">
                        <td className="px-5 py-4 font-medium flex items-center gap-2 text-paperstory-ink">
                          <span className="text-xl">{row.flag}</span>
                          <span>{row.country}</span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-paperstory-maroon">
                          {row.minDays} – {row.maxDays} Business Days
                        </td>
                        <td className="px-5 py-4 text-paperstory-ink/80">{row.courier}</td>
                        <td className="px-5 py-4 text-xs text-paperstory-ink/70">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-center text-xs text-paperstory-ink/60">
              * Remote area destinations may require 2–3 additional transit days. Digital invitations require 0 shipping transit and are delivered online within 24–48 hours.
            </p>
          </div>

          {/* How It Works (Custom Order Workflow) */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-semibold tracking-widest text-paperstory-maroon uppercase">
                Step-by-Step Experience
              </span>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-paperstory-maroon">
                How Custom Ordering Works
              </h2>
              <p className="mt-2 text-sm sm:text-base text-paperstory-ink/70">
                From your initial idea to unboxing your stationery suite, here is our simple 5-step process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="rounded-2xl bg-white border border-paperstory-maroon/10 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-paperstory-maroon/10 text-paperstory-maroon font-bold text-sm">
                        0{step.step}
                      </span>
                    </div>
                    <h3 className="font-serif font-semibold text-base text-paperstory-ink mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-paperstory-ink/75 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital vs Physical + Shipping Policy Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Digital vs Physical */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-paperstory-maroon/15 p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-paperstory-maroon">
                Digital Invites vs. Physical Print Suites
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-paperstory-ink/80 leading-relaxed">
                <div className="p-4 rounded-xl bg-paperstory-wash/50 border border-paperstory-maroon/10">
                  <h4 className="font-bold text-paperstory-maroon mb-1">📱 Digital & Animated Invitations</h4>
                  <p>
                    Zero shipping wait! Delivered as ultra-high-definition MP4 videos or JPG/PDF formats ready for instant sharing on WhatsApp, iMessage, and email. Typical turnaround is 24 to 48 hours worldwide.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-paperstory-wash/50 border border-paperstory-maroon/10">
                  <h4 className="font-bold text-paperstory-maroon mb-1">💌 Handcrafted Physical Suites</h4>
                  <p>
                    Printed on imported fine cardstock with gold foil stamping, letterpress, acrylic, or velvet details. Production takes 10 to 14 working days after artwork approval, followed by tracked express courier dispatch.
                  </p>
                </div>
              </div>
            </div>

            {/* International Customs & Payment Info */}
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-paperstory-maroon/15 p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-paperstory-maroon">
                International Customs & Payments
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-paperstory-ink/80 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-paperstory-maroon font-bold">✓</span>
                  <span><strong>Door-to-Door Tracking:</strong> A live DHL or FedEx tracking link is shared with you immediately upon dispatch so you can monitor transit in real time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-paperstory-maroon font-bold">✓</span>
                  <span><strong>Customs & Import Duties:</strong> Depending on your country’s regulations (e.g. UK VAT or EU customs), parcels may occasionally incur local customs fees or import clearance duties, which are handled directly by the carrier upon arrival.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-paperstory-maroon font-bold">✓</span>
                  <span><strong>International Payment Methods:</strong> We accept international bank wire transfers, Wise, Western Union, and domestic Pakistani payment methods (Bank Transfer, JazzCash, NayaPay).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-paperstory-maroon font-bold">✓</span>
                  <span><strong>Protective Packaging:</strong> Luxury wedding cards and certificate boxes are packaged inside reinforced protective crates to guarantee zero corner damage during air transit.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom WhatsApp CTA */}
          <div className="text-center rounded-2xl bg-paperstory-wash p-8 sm:p-12 border border-paperstory-maroon/10">
            <h3 className="font-serif text-2xl font-semibold text-paperstory-maroon">
              Ready to create your custom suite?
            </h3>
            <p className="mt-2 text-sm text-paperstory-ink/75 max-w-xl mx-auto">
              Message us on WhatsApp with your destination city and event date for a bespoke quote including shipping.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={WHATSAPP_SHIPPING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-paperstory-maroon px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-sm hover:opacity-90 transition cursor-pointer"
              >
                <span>Chat on WhatsApp</span>
                <span>💬</span>
              </a>
              <Link
                to="/shop/wedding-invitations"
                className="inline-flex items-center gap-2 rounded-full border border-paperstory-maroon/30 bg-white px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-paperstory-maroon hover:bg-paperstory-wash transition"
              >
                <span>Browse Invitations</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}


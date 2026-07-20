import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Seo from '../components/Seo'
import { useInView } from '../hooks/useInView'

import { INSTAGRAM_URL } from '../data/products'
import { STORE_EMAIL } from '../data/site'
import { PAGE_SEO } from '../utils/seo'

const WHATSAPP_URL = 'https://wa.me/923144392928?text=Hi!%20I%27d%20like%20to%20get%20in%20touch%20about%20The%20Paper%20Story.'

export default function ContactPage() {
  const [ref, isVisible] = useInView()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <Seo
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        path="/contact"
      />
      <PageHeader title="Contact Us" subtitle="Reach out for orders, custom quotes, or any questions." breadcrumb="Home / Contact" />
      <section className="bg-paperstory-cream py-16 sm:py-20">
        <div ref={ref} className={`mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-paperstory-maroon">Get in Touch</h2>
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-lg font-semibold">WhatsApp</h3>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-paperstory-maroon hover:text-paperstory-berry">+92 314 4392928</a>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-lg font-semibold">Email</h3>
                <a href={`mailto:${STORE_EMAIL}`} className="text-paperstory-maroon hover:text-paperstory-berry">{STORE_EMAIL}</a>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-lg font-semibold">Instagram</h3>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-paperstory-maroon hover:text-paperstory-berry">
                  @thepaperstory.co
                </a>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-serif text-lg font-semibold">Payments</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  Cash on Delivery (COD) is available on selected products within Pakistan, such as stationery items and cake boxes. Advance payment is required for all other products and international orders.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            {submitted ? (
              <p className="rounded-xl bg-paperstory-blush/50 px-5 py-4">Thank you! We'll get back to you shortly.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-5">
                <input type="text" required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-paperstory-blush bg-paperstory-cream/50 px-4 py-3" />
                <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-paperstory-blush bg-paperstory-cream/50 px-4 py-3" />
                <textarea required rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full resize-none rounded-xl border border-paperstory-blush bg-paperstory-cream/50 px-4 py-3" />
                <button type="submit" className="gradient-btn w-full rounded-full py-3 text-sm font-semibold text-white uppercase">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

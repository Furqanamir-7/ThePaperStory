import { useState } from 'react'
import { useInView } from '../hooks/useInView'

export default function Newsletter() {
  const [ref, isVisible] = useInView()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="gradient-section py-6 sm:py-16">
      <div
        ref={ref}
        className={`mx-auto max-w-2xl px-4 text-center sm:px-6 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <h2 className="heading-light mb-3 text-2xl font-semibold sm:text-4xl">
          Join Our Story
        </h2>
        <p className="mb-8 text-sm text-white/90 sm:text-base">
          Be the first to know about new collections, wedding trends, and exclusive offers.
        </p>

        {submitted ? (
          <p className="rounded-full bg-white/20 px-6 py-3 text-white">
            Thank you for subscribing! 💌
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:gap-0">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[48px] flex-1 rounded-full border-0 bg-white/95 px-5 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 focus:outline-none sm:rounded-r-none"
            />
            <button
              type="submit"
              className="min-h-[48px] rounded-full bg-paperstory-maroon-deep px-8 py-3 text-sm font-semibold tracking-wide text-white uppercase transition-all hover:bg-paperstory-maroon sm:rounded-l-none"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

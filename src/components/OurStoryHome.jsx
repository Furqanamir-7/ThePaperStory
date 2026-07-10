import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'

export default function OurStoryHome() {
  const [ref, isVisible] = useInView()

  return (
    <section className="section-wash py-16 sm:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-paperstory-maroon/70 uppercase">
          Our Story
        </p>
        <h2 className="heading-brand mb-6 font-serif text-3xl font-semibold sm:text-4xl">
          About The Paper Story
        </h2>
        <p className="mb-8 text-base leading-relaxed text-paperstory-ink/75 sm:text-lg">
          At The Paper Story, we create thoughtfully designed stationery for life&apos;s most meaningful
          celebrations. As a husband and wife team, we personally design, produce, and package every
          order, ensuring exceptional quality and attention to detail.
        </p>
        <Link to="/about" className="text-sm font-semibold tracking-wide text-paperstory-maroon uppercase hover:underline">
          Read our full story →
        </Link>
      </div>
    </section>
  )
}

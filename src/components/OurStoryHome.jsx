import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'

export default function OurStoryHome() {
  const [ref, isVisible] = useInView()

  return (
    <section className="section-wash py-5 sm:py-16">
      <div
        ref={ref}
        className={`mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="home-story-outline">
          <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-paperstory-maroon/70 uppercase sm:mb-3">
            Our Story
          </p>
          <h2 className="heading-brand mb-3 font-serif text-2xl font-semibold sm:mb-6 sm:text-4xl">
            About The Paper Story
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-paperstory-ink/75 sm:mb-8 sm:text-lg">
            At The Paper Story, we create thoughtfully designed stationery for life&apos;s most meaningful
            celebrations. As a husband and wife team, we personally design, produce, and package every
            order, ensuring exceptional quality and attention to detail.
          </p>
          <Link
            to="/about"
            className="text-sm font-semibold tracking-wide text-paperstory-maroon uppercase hover:underline"
          >
            Read our full story →
          </Link>
        </div>
      </div>
    </section>
  )
}

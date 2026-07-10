import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'

const storyBoxes = [
  {
    title: 'Thoughtful design',
    text: 'We create thoughtfully designed stationery for life’s most meaningful celebrations.',
  },
  {
    title: 'Husband & wife team',
    text: 'As Fatima and Huzaifa, we personally design, produce, and package every order.',
  },
  {
    title: 'Exceptional quality',
    text: 'A hands-on studio approach that ensures attention to detail in every piece.',
  },
]

export default function OurStoryHome() {
  const [ref, isVisible] = useInView()

  return (
    <section className="section-wash py-16 sm:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-paperstory-maroon/70 uppercase">
            Our Story
          </p>
          <h2 className="heading-brand mb-4 font-serif text-3xl font-semibold sm:text-4xl">
            About The Paper Story
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-paperstory-ink/75 sm:text-lg">
            At The Paper Story, we create thoughtfully designed stationery for life&apos;s most meaningful
            celebrations. As a husband and wife team, we personally design, produce, and package every
            order, ensuring exceptional quality and attention to detail.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {storyBoxes.map((box) => (
            <div key={box.title} className="home-story-box">
              <h3 className="mb-2 font-serif text-xl font-semibold text-paperstory-maroon">{box.title}</h3>
              <p className="text-sm leading-relaxed text-paperstory-ink/70">{box.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
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

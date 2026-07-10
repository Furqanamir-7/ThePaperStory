import PageHeader from '../components/PageHeader'
import BrandStory from '../components/BrandStory'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Our Story"
        subtitle="A boutique stationery house born from a love of beautiful paper, thoughtful design, and the stories that bring people together."
        breadcrumb="Home / About"
      />
      <BrandStory showHeader={false} />
      <section className="bg-paperstory-cream py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 font-serif text-3xl font-semibold text-paperstory-maroon">
            Crafted With Intention
          </h2>
          <p className="mb-6 leading-relaxed text-gray-600">
            Every order at The Paper Story begins with a conversation. We listen to your vision,
            refine the details, and translate your story into paper — whether that's a once-in-a-lifetime
            wedding suite, a digital invite shared across continents, or bespoke packaging that makes
            your brand unforgettable.
          </p>
          <p className="leading-relaxed text-gray-600">
            From our studio to your doorstep, we handle each piece with the care it deserves.
            Worldwide delivery means your beautiful paper can reach loved ones wherever they are.
          </p>
        </div>
      </section>
      <Testimonials />
      <Newsletter />
    </>
  )
}

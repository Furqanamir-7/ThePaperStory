import PageHeader from '../components/PageHeader'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import { useInView } from '../hooks/useInView'

function AboutBody() {
  const [ref, isVisible] = useInView()

  return (
    <section className="bg-paperstory-cream py-16 sm:py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <p className="mb-8 text-center text-lg leading-relaxed text-paperstory-ink/80 sm:text-xl">
          At The Paper Story, we believe that every celebration begins with thoughtful details.
        </p>

        <div className="space-y-6 text-base leading-relaxed text-paperstory-ink/75 sm:text-[1.05rem]">
          <p>
            Founded by husband-and-wife duo Fatima and Huzaifa, The Paper Story was built on a shared
            passion for creativity and craftsmanship. Fatima, a traditional artist and self-taught
            graphic designer, creates each design with a focus on elegance, while Huzaifa brings every
            piece to life through careful printing and production.
          </p>
          <p>
            We&apos;re a small studio by choice, which means every order is personally designed,
            produced, checked, and packaged by us. This hands-on approach allows us to maintain the
            quality, attention to detail, and personal service that our customers value.
          </p>
          <p>
            Whether it&apos;s a wedding invitation, a keepsake, or custom stationery, every piece we
            create is made with care and is designed to become part of your story.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-paperstory-wash px-6 py-7 text-center">
            <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-paperstory-maroon/65 uppercase">
              Design
            </p>
            <h3 className="mb-2 font-serif text-2xl font-semibold text-paperstory-maroon">Fatima</h3>
            <p className="text-sm leading-relaxed text-paperstory-ink/70">
              Traditional artist &amp; self-taught graphic designer — creating each piece with elegance
              and emotion.
            </p>
          </div>
          <div className="rounded-2xl bg-paperstory-wash px-6 py-7 text-center">
            <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-paperstory-maroon/65 uppercase">
              Production
            </p>
            <h3 className="mb-2 font-serif text-2xl font-semibold text-paperstory-maroon">Huzaifa</h3>
            <p className="text-sm leading-relaxed text-paperstory-ink/70">
              Bringing every design to life through careful printing, finishing, and packaging.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About The Paper Story"
        subtitle="Every celebration begins with thoughtful details."
        breadcrumb="Home / About"
      />
      <AboutBody />
      <Testimonials />
      <Newsletter />
    </>
  )
}

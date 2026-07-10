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
        <div className="space-y-6 text-base leading-relaxed text-paperstory-ink/75 sm:text-[1.05rem]">
          <p>
            The Paper Story started before we got married, with a simple idea—to create stationery that
            people would genuinely love to keep.
          </p>
          <p>
            We&apos;re Fatima and Huzaifa, a husband-and-wife team behind the brand. Fatima, a
            traditional artist and self-taught graphic designer, designs every piece, while Huzaifa
            takes care of the printing and production to make sure each order is finished to the
            highest standard.
          </p>
          <p>
            We don&apos;t have a large team, and that&apos;s exactly how we like it. Every order is
            designed, printed, checked, and packed by us. It takes more time, but it means we know
            every piece that leaves our studio meets the quality we&apos;d be proud to put our name
            on.
          </p>
          <p>
            From wedding invitations to keepsakes and custom stationery, everything we create is made
            with care and attention to detail. We&apos;re grateful to be part of your celebrations and
            hope our work becomes a small but meaningful part of your story.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-paperstory-wash px-6 py-7 text-center">
            <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-paperstory-maroon/65 uppercase">
              Design
            </p>
            <h3 className="mb-2 font-serif text-2xl font-semibold text-paperstory-maroon">Fatima</h3>
            <p className="text-sm leading-relaxed text-paperstory-ink/70">
              Traditional artist &amp; self-taught graphic designer — designing every piece with care.
            </p>
          </div>
          <div className="rounded-2xl bg-paperstory-wash px-6 py-7 text-center">
            <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-paperstory-maroon/65 uppercase">
              Production
            </p>
            <h3 className="mb-2 font-serif text-2xl font-semibold text-paperstory-maroon">Huzaifa</h3>
            <p className="text-sm leading-relaxed text-paperstory-ink/70">
              Printing and production — finishing every order to the highest standard.
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
        title="Our Story"
        subtitle="Stationery people would genuinely love to keep."
        breadcrumb="Home / About"
      />
      <AboutBody />
      <Testimonials />
      <Newsletter />
    </>
  )
}

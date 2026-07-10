import { useInView } from '../hooks/useInView'

const weddings = [
  {
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&fit=crop',
    couple: 'Ayesha & Omar',
    detail: 'Wedding invitations & favours',
  },
  {
    image: 'https://images.unsplash.com/photo-1522673606300-2744e24c2470?w=800&h=1000&fit=crop',
    couple: 'Hina & Bilal',
    detail: 'Nikkah Certificate suite',
  },
  {
    image: '/e-invites/static-2.png',
    couple: 'Zainab & Ali',
    detail: 'Animated e-invite & stationery',
  },
  {
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=1000&fit=crop',
    couple: 'Maryam & Hassan',
    detail: 'Bespoke wedding stationery',
  },
]

export default function RealWeddings() {
  const [ref, isVisible] = useInView()

  return (
    <section className="bg-paperstory-cream py-5 sm:py-16">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="mb-5 text-center sm:mb-12">
          <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-paperstory-maroon/65 uppercase sm:mb-3">
            Real moments
          </p>
          <h2 className="heading-brand mb-2 text-2xl font-semibold sm:mb-3 sm:text-4xl">Real Weddings</h2>
          <p className="mx-auto max-w-xl text-sm text-paperstory-ink/75 sm:text-base">
            Love stories brought to life through paper, print, and thoughtful detail.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {weddings.map((wedding) => (
            <article key={wedding.couple} className="group">
              <div className="mb-4 overflow-hidden rounded-2xl">
                <img
                  src={wedding.image}
                  alt={`${wedding.couple} wedding stationery`}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-lg font-semibold text-paperstory-ink">{wedding.couple}</h3>
              <p className="mt-1 text-sm text-paperstory-ink/65">{wedding.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

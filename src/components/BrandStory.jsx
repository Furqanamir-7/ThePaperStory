import { useInView } from '../hooks/useInView'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Worldwide Delivery',
    text: 'We ship our beautiful creations to brides and gift-givers across the globe.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
    title: 'Custom Printing',
    text: 'Every design is tailored to your story — colours, fonts, and finishes included.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Handcrafted Quality',
    text: 'Premium papers, thoughtful details, and artisanal care in every piece.',
  },
]

export default function BrandStory({
  showHeader = true,
  eyebrow = 'Why The Paper Story',
  title = 'Where Every Detail Tells Your Story',
}) {
  const [ref, isVisible] = useInView()

  return (
    <section className="relative overflow-hidden section-wash py-16 sm:py-24">
      <div
        ref={ref}
        className={`mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="relative overflow-hidden rounded-3xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1586075010923-2dd457f5f5a0?w=800&h=900&fit=crop"
            alt="Handcrafted stationery"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paperstory-maroon-deep/30 to-transparent" />
        </div>

        <div>
          {showHeader && (
            <>
              <p className="mb-3 text-sm font-medium tracking-[0.15em] text-paperstory-berry uppercase">{eyebrow}</p>
              <h2 className="mb-6 font-serif text-3xl font-semibold text-paperstory-maroon sm:text-4xl">{title}</h2>
            </>
          )}
          <p className="mb-8 leading-relaxed text-gray-600">
            Born from a love of beautiful paper and meaningful moments, The Paper Story creates
            premium stationery and gifting that feels as special as the occasions they celebrate.
            From intimate weddings to corporate gifting, we bring warmth, elegance, and a personal
            touch to every order.
          </p>

          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paperstory-blush text-paperstory-maroon">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

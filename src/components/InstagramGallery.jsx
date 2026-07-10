import { useInView } from '../hooks/useInView'
import { INSTAGRAM_URL } from '../data/products'

const posts = [
  {
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=700&h=700&fit=crop',
    alt: 'Wedding invitation flat lay',
  },
  {
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=700&h=700&fit=crop',
    alt: 'Greeting card details',
  },
  {
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&h=700&fit=crop',
    alt: 'Wedding favours',
  },
  {
    image: 'https://images.unsplash.com/photo-1522673606300-2744e24c2470?w=700&h=700&fit=crop',
    alt: 'Nikkah Certificate styling',
  },
  {
    image: 'https://images.unsplash.com/photo-1586075010923-2dd457f5f5a0?w=700&h=700&fit=crop',
    alt: 'Stationery desk setup',
  },
  {
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=700&h=700&fit=crop',
    alt: 'Eidi envelopes',
  },
]

export default function InstagramGallery() {
  const [ref, isVisible] = useInView()

  return (
    <section className="section-wash py-8 sm:py-16">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="mb-6 text-center sm:mb-12">
          <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-paperstory-maroon/65 uppercase sm:mb-3">
            @thepaperstory.co
          </p>
          <h2 className="heading-brand mb-2 text-2xl font-semibold sm:mb-3 sm:text-4xl">Instagram Gallery</h2>
          <p className="mx-auto max-w-xl text-sm text-paperstory-ink/75 sm:text-base">
            A peek into recent designs, packaging, and celebration moments.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <a
              key={post.alt}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-xl"
            >
              <img
                src={post.image}
                alt={post.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-paperstory-maroon/0 transition-colors duration-300 group-hover:bg-paperstory-maroon/35">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="scale-90 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 text-center sm:mt-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cute-btn-primary inline-flex"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}

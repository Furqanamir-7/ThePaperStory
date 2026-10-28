import { Link } from 'react-router-dom'
import BrandWordmark from './BrandWordmark'
import MarqueeTicker from './MarqueeTicker'
import { SITE_TAGLINE } from '../data/site'

const WHATSAPP_URL =
  'https://wa.me/923144392928?text=Hi!%20I%27d%20like%20to%20know%20more%20about%20The%20Paper%20Story.'

export default function Hero() {
  return (
    <section id="home" className="cute-hero relative overflow-hidden lg:min-h-screen">
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-paperstory-blush/60 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-paperstory-berry/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-12 lg:min-h-screen lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:pb-28 lg:pt-32">
        <div className="flex min-w-0 flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.35em] text-paperstory-maroon/70 uppercase sm:mb-4">
            Welcome to
          </p>

          <div className="mb-4 flex max-w-full items-center gap-3 sm:mb-6 sm:gap-4">
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="h-14 w-14 shrink-0 rounded-full sm:h-20 sm:w-20"
            />
            <BrandWordmark size="lg" variant="dark" className="min-w-0" />
          </div>

        <p className="mb-4 max-w-md px-1 font-serif text-lg leading-relaxed text-paperstory-ink/90 italic sm:mb-6 sm:text-2xl">
          {SITE_TAGLINE}
        </p>

          <div className="flex w-full justify-center lg:justify-start">
            <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link to="/shop" className="cute-btn-primary">VIEW COLLECTION</Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="cute-btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 hidden flex-1 sm:mt-10 lg:mt-0 lg:block" aria-hidden="true" />
      </div>

      <MarqueeTicker />
    </section>
  )
}

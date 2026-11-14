import { Link } from 'react-router-dom'
import { getCountrySeo } from '../utils/seo'

export default function CountryBanner({ countryCode }) {
  const info = getCountrySeo(countryCode)
  if (!info) return null

  return (
    <div className="bg-paperstory-maroon text-white border-b border-paperstory-maroon-deep shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="text-xl sm:text-2xl shrink-0">{info.flag}</span>
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-wide">
                <span>Delivering to {info.name}</span>
                <span className="hidden sm:inline mx-2 text-white/50">•</span>
                <span className="text-paperstory-sand font-normal block sm:inline">
                  {info.transitTime}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-mono font-semibold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
              Quotes in {info.currency} ({info.currencySymbol.trim()})
            </span>
            <Link
              to="/shipping"
              className="text-xs font-semibold text-white underline hover:text-paperstory-sand transition"
            >
              Shipping Guide →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


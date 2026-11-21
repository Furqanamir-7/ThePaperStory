import { Link, useLocation } from 'react-router-dom'
import { shopCategories, INSTAGRAM_URL } from '../data/products'
import { STORE_EMAIL } from '../data/site'
import { LOCALES, localeUrl } from '../config/locales'
import BrandWordmark from './BrandWordmark'

export default function Footer() {
  const location = useLocation()
  const currentPath = location.pathname || '/'
  return (
    <footer className="bg-paperstory-maroon-deep pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-paperstory-cream sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="lg:col-span-3">
            <div className="mb-3 flex items-center gap-2.5">
              <img src="/logo.png" alt="" aria-hidden="true" className="h-10 w-10 rounded-full" />
              <BrandWordmark size="sm" variant="light" />
            </div>
            <p className="mb-3 max-w-xs text-xs text-paperstory-cream/80 leading-relaxed">
              Custom stationery &amp; bespoke printing for celebrations worldwide. Designed and crafted in our studio.
            </p>
            <Link
              to="/shipping"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-paperstory-cream font-medium hover:bg-white/20 transition"
            >
              <span>✈️ We Ship Worldwide</span>
              <span>→</span>
            </Link>
          </div>

          {/* Shop Categories - Divided into 2 Columns / Lines */}
          <div className="lg:col-span-5">
            <h3 className="mb-2.5 font-sans text-xs font-bold tracking-widest text-paperstory-cream uppercase">
              Shop Categories
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-[13px]">
              <li>
                <Link to="/shop" className="font-semibold text-paperstory-cream hover:underline">
                  All Products →
                </Link>
              </li>
              {shopCategories.map((cat) => (
                <li key={cat.slug} className="truncate">
                  <Link
                    to={`/shop/${cat.slug}`}
                    className="text-paperstory-cream/80 hover:text-paperstory-cream hover:underline transition"
                    title={cat.label}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Pages */}
          <div className="lg:col-span-2">
            <h3 className="mb-2.5 font-sans text-xs font-bold tracking-widest text-paperstory-cream uppercase">
              Pages
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-[13px]">
              <li>
                <Link to="/" className="text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">
                  Worldwide Shipping
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">
                  Browse Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            <h3 className="mb-2.5 font-sans text-xs font-bold tracking-widest text-paperstory-cream uppercase">
              Contact
            </h3>
            <ul className="space-y-2 text-xs sm:text-[13px] text-paperstory-cream/85">
              <li>
                <a
                  href="https://wa.me/923144392928"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paperstory-cream transition"
                >
                  WhatsApp: +92 314 4392928
                </a>
              </li>
              <li className="truncate">
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-paperstory-cream transition" title={STORE_EMAIL}>
                  {STORE_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paperstory-cream transition"
                >
                  @thepaperstory.co
                </a>
              </li>
            </ul>
            <p className="mt-2.5 text-[11px] leading-relaxed text-paperstory-cream/65">
              Cash on Delivery (COD) available on selected stationery within Pakistan.
            </p>
          </div>
        </div>

        {/* Popular Search Keywords & Internal Links for SEO */}
        <div className="mt-8 border-t border-paperstory-cream/15 pt-5">
          <div className="text-[11px] text-paperstory-cream/70 leading-relaxed">
            <span className="font-semibold text-paperstory-cream/90 mr-2">Popular Searches:</span>
            <Link to="/shop/wedding-invitations" className="hover:text-paperstory-cream hover:underline">
              Custom Wedding Cards Pakistan
            </Link>
            <span className="mx-2 text-paperstory-cream/40">•</span>
            <Link to="/shop/nikkahnama" className="hover:text-paperstory-cream hover:underline">
              Luxury Nikkahnama Certificates
            </Link>
            <span className="mx-2 text-paperstory-cream/40">•</span>
            <Link to="/shop/digital-invitations" className="hover:text-paperstory-cream hover:underline">
              Animated WhatsApp Video Invites
            </Link>
            <span className="mx-2 text-paperstory-cream/40">•</span>
            <Link to="/shop/accessories-add-ons" className="hover:text-paperstory-cream hover:underline">
              Custom Wax Seal Stamps &amp; Stickers
            </Link>
            <span className="mx-2 text-paperstory-cream/40">•</span>
            <Link to="/shop/packaging" className="hover:text-paperstory-cream hover:underline">
              Custom Rigid Boxes &amp; Packaging
            </Link>
            <span className="mx-2 text-paperstory-cream/40">•</span>
            <Link to="/shop/favours" className="hover:text-paperstory-cream hover:underline">
              Wedding Favours &amp; Keepsake Tins
            </Link>
            <span className="mx-2 text-paperstory-cream/40">•</span>
            <Link to="/shipping" className="hover:text-paperstory-cream hover:underline">
              Worldwide Express Shipping (USA, UK, UAE, Canada)
            </Link>
          </div>
        </div>

        {/* International Markets & Country Switcher */}
        <div className="mt-4 border-t border-paperstory-cream/10 pt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-paperstory-cream/70">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-paperstory-cream/90">Regional Stores:</span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {LOCALES.map((loc) => (
                  <a
                    key={loc.code}
                    href={localeUrl(loc, currentPath)}
                    className="hover:text-paperstory-cream hover:underline transition"
                    title={`The Paper Story - ${loc.label}`}
                  >
                    {loc.label}
                  </a>
                ))}
              </div>
            </div>
            <Link
              to="/shipping"
              className="font-medium text-paperstory-gold hover:underline shrink-0"
            >
              Shipping Policy &amp; Transit Times →
            </Link>
          </div>
        </div>

        {/* Compact Copyright Footer */}
        <div className="mt-4 border-t border-paperstory-cream/10 pt-4 text-center text-[11px] text-paperstory-cream/60">
          © {new Date().getFullYear()} The Paper Story. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

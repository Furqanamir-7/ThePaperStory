import { Link } from 'react-router-dom'
import { shopCategories, INSTAGRAM_URL } from '../data/products'
import { STORE_EMAIL } from '../data/site'
import BrandWordmark from './BrandWordmark'

export default function Footer() {
  return (
    <footer className="bg-paperstory-maroon-deep pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-paperstory-cream sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo.png" alt="" aria-hidden="true" className="h-12 w-12 rounded-full" />
              <BrandWordmark size="md" variant="light" />
            </div>
            <p className="mb-4 max-w-xs text-sm text-paperstory-cream/85">
              Premium stationery and gifting for life's most beautiful moments.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-paperstory-cream">
              Worldwide Delivery 🌍
            </span>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-sm font-bold tracking-widest text-paperstory-cream uppercase">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-sm text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">All Products</Link></li>
              {shopCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/shop/${cat.slug}`} className="text-sm text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">{cat.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-sm font-bold tracking-widest text-paperstory-cream uppercase">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-paperstory-cream/80 hover:text-paperstory-cream hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-sans text-sm font-bold tracking-widest text-paperstory-cream uppercase">Contact</h3>
            <ul className="space-y-3 text-sm text-paperstory-cream/85">
              <li>
                <a href="https://wa.me/923144392928" target="_blank" rel="noopener noreferrer" className="hover:text-paperstory-cream">
                  WhatsApp: +92 314 4392928
                </a>
              </li>
              <li>
                <a href={`mailto:${STORE_EMAIL}`} className="hover:text-paperstory-cream">{STORE_EMAIL}</a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-paperstory-cream"
                >
                  Instagram: @thepaperstory.co
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-paperstory-cream/70">
              Stationery: COD in Pakistan. All other items: advance payment (local &amp; international).
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-paperstory-cream/20 pt-8 text-center text-xs text-paperstory-cream/65">
          © {new Date().getFullYear()} The Paper Story. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

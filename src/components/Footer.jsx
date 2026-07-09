const footerLinks = {
  Shop: ['Wedding Invitations', 'E-Invites', 'Cards & Favours', 'Custom Packaging', 'Gifting'],
  Company: ['About Us', 'Contact', 'FAQs', 'Shipping & Returns'],
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-paperstory-maroon-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="/logo.png"
              alt="The Paper Story"
              className="mb-4 h-16 w-16 rounded-full"
            />
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-white/80">
              Premium stationery and gifting for life's most beautiful moments. Crafted with care,
              delivered worldwide.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              Worldwide Delivery 🌍
            </span>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 font-serif text-lg font-semibold">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/75 transition-colors hover:text-white hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a
                  href="https://wa.me/923144392928"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  WhatsApp: +92 314 4392928
                </a>
              </li>
              <li>
                <a href="mailto:hello@thepaperstory.co" className="transition-colors hover:text-white">
                  hello@thepaperstory.co
                </a>
              </li>
              <li>thepaperstory.co</li>
            </ul>

            <div className="mt-6 flex gap-3">
              {['instagram', 'facebook', 'pinterest'].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <span className="text-xs font-semibold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 sm:flex-row">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} The Paper Story. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>PayPal</span>
            <span>•</span>
            <span>Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

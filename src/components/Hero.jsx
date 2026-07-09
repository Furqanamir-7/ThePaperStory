import FloralAccent from './FloralAccent'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden gradient-hero">
      <FloralAccent className="top-24 left-8 text-white" opacity={0.15} />
      <FloralAccent className="right-12 bottom-32 text-white" opacity={0.1} />
      <FloralAccent className="top-1/2 left-1/3 text-white" opacity={0.08} />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-24 pb-16 text-center sm:px-6 lg:flex-row lg:gap-12 lg:text-left">
        <div className="max-w-2xl lg:flex-1">
          <p className="mb-4 text-sm font-medium tracking-[0.2em] text-white/80 uppercase">
            Premium Stationery & Gifting
          </p>
          <h1 className="mb-6 font-serif text-4xl leading-tight font-semibold text-white sm:text-5xl lg:text-6xl">
            Every Story Deserves Beautiful Paper
          </h1>
          <p className="mb-8 text-base leading-relaxed text-white/90 sm:text-lg">
            Handcrafted wedding invitations, elegant e-invites, and bespoke gifting —
            designed with love and delivered worldwide.
          </p>
          <a
            href="#shop"
            className="gradient-btn inline-flex min-h-[44px] items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-wide text-white uppercase"
          >
            Shop the Collection
          </a>
        </div>

        <div className="mt-12 flex flex-1 items-center justify-center lg:mt-0">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-white/10 blur-2xl" />
            <svg
              className="relative h-64 w-64 text-white/30 sm:h-80 sm:w-80"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M100 30 C90 50, 70 55, 60 75 C50 95, 55 115, 75 125 C95 135, 115 130, 125 110 C135 90, 130 70, 110 60 C105 55, 100 45, 100 30Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M100 125 L100 170 M85 155 C92 162, 108 162, 115 155" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="75" cy="70" r="8" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="125" cy="70" r="8" stroke="currentColor" strokeWidth="1.2" />
              <path d="M40 100 Q100 80 160 100" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
              <path d="M50 140 Q100 120 150 140" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

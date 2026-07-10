import FloralAccent from './FloralAccent'

export default function PageHeader({ title, subtitle, breadcrumb, compact = false }) {
  return (
    <section
      className={`relative overflow-hidden gradient-hero ${
        compact ? 'pt-28 pb-5 sm:pt-32 sm:pb-6' : 'pt-32 pb-16 sm:pt-36 sm:pb-20'
      }`}
    >
      <FloralAccent className="top-20 right-10 text-white" opacity={0.1} />
      <FloralAccent className="bottom-8 left-8 text-white" opacity={0.08} />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {breadcrumb && (
          <p className={`font-medium tracking-wide text-white/75 ${compact ? 'mb-2 text-xs' : 'mb-4 text-sm'}`}>
            {breadcrumb}
          </p>
        )}
        <h1 className={`heading-light font-semibold ${compact ? 'mb-2 text-3xl sm:text-4xl' : 'mb-4 text-4xl sm:text-5xl'}`}>
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mx-auto max-w-2xl leading-relaxed text-white/90 ${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

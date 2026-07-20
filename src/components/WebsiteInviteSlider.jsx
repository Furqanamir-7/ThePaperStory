export default function WebsiteInviteSlider({ image, href, title, subtitle }) {
  return (
    <div className="website-invite-preview mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <h2 className="heading-brand font-serif text-3xl font-semibold text-paperstory-maroon sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-base text-paperstory-ink/70 sm:text-lg">{subtitle}</p>
        ) : null}
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="website-invite-preview-link group block overflow-hidden rounded-2xl border border-paperstory-blush/60 bg-white shadow-[0_16px_40px_rgba(163,30,59,0.12)] transition-transform duration-300 hover:-translate-y-1"
        aria-label={`Open ${title} wedding website invitation`}
      >
        <img
          src={image}
          alt={title}
          className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />
      </a>
    </div>
  )
}

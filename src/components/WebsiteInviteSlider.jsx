export default function WebsiteInviteSlider({ image, href, title, subtitle }) {
  return (
    <div className="website-invite-preview mx-auto flex max-w-7xl flex-col items-center px-4 py-4 sm:px-6 lg:px-8">
      {subtitle ? (
        <p className="mb-4 max-w-md text-center text-sm text-paperstory-ink/70 sm:text-base">
          {subtitle}
        </p>
      ) : null}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="website-invite-preview-link group block overflow-hidden rounded-2xl border border-paperstory-blush/60 bg-white shadow-[0_12px_32px_rgba(163,30,59,0.1)] transition-transform duration-300 hover:-translate-y-0.5"
        aria-label={`Open ${title} wedding website invitation`}
      >
        <img
          src={image}
          alt={title}
          className="website-invite-preview-img"
        />
      </a>
    </div>
  )
}

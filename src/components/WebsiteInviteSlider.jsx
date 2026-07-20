export default function WebsiteInviteSlider({ image, href, title, subtitle }) {
  return (
    <div className="website-invite-preview mx-auto flex max-w-7xl flex-col items-center px-2 py-2 sm:px-4">
      {subtitle ? (
        <p className="mb-3 max-w-md text-center text-sm text-paperstory-ink/70 sm:text-base">
          {subtitle}
        </p>
      ) : null}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="website-invite-preview-link group block overflow-hidden transition-opacity duration-300 hover:opacity-95"
        aria-label={`Open ${title} wedding website invitation`}
      >
        <img src={image} alt={title} className="website-invite-preview-img" />
      </a>
    </div>
  )
}

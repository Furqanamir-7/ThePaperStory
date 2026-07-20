export default function WebsiteInviteSlider({ image, href, title, subtitle }) {
  return (
    <div className="website-invite-preview">
      {subtitle ? <p className="website-invite-preview-caption">{subtitle}</p> : null}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="website-invite-preview-link group"
        aria-label={`Open ${title} wedding website invitation`}
      >
        <img src={image} alt={title} className="website-invite-preview-img" />
      </a>
    </div>
  )
}

function MarqueeFlower() {
  return (
    <svg className="marquee-flower" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="32" cy="19" rx="9.5" ry="13.5" />
        <ellipse cx="32" cy="19" rx="9.5" ry="13.5" transform="rotate(72 32 32)" />
        <ellipse cx="32" cy="19" rx="9.5" ry="13.5" transform="rotate(144 32 32)" />
        <ellipse cx="32" cy="19" rx="9.5" ry="13.5" transform="rotate(216 32 32)" />
        <ellipse cx="32" cy="19" rx="9.5" ry="13.5" transform="rotate(288 32 32)" />
      </g>
    </svg>
  )
}

const items = [
  'LUXURY WEDDING INVITATIONS',
  'BESPOKE STATIONERY',
  'CUSTOM DESIGNING, PRINTING & PACKAGING',
  'WORLDWIDE SHIPPING',
  'NIKKAH CERTIFICATE',
  'E-INVITE',
  'ANIMATED INVITATION',
  'BESPOKE WEDDING STATIONERY',
  'CUSTOM WEDDING INVITATIONS',
  'FAVOURS',
]

function MarqueeContent() {
  return (
    <>
      {items.map((item) => (
        <span key={item} className="marquee-item">
          {item}
          <MarqueeFlower />
        </span>
      ))}
    </>
  )
}

export default function MarqueeTicker() {
  return (
    <div className="marquee-ticker">
      <div className="marquee-track">
        <div className="marquee-track-group">
          <MarqueeContent />
        </div>
        <div className="marquee-track-group" aria-hidden="true">
          <MarqueeContent />
        </div>
      </div>
    </div>
  )
}

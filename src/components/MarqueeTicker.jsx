import { useAdminData } from '../admin/AdminDataContext'

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

const DEFAULT_ITEMS = [
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

function MarqueeContent({ items }) {
  return (
    <>
      {items.map((item, idx) => (
        <span key={`${item}-${idx}`} className="marquee-item">
          {item}
          <MarqueeFlower />
        </span>
      ))}
    </>
  )
}

export default function MarqueeTicker() {
  let marqueeConfig = null
  try {
    const admin = useAdminData()
    marqueeConfig = admin?.marquee
  } catch {}

  if (marqueeConfig && !marqueeConfig.enabled) {
    return null
  }

  const items =
    marqueeConfig?.items?.filter((i) => i.active).map((i) => i.text) || DEFAULT_ITEMS

  return (
    <div
      className="marquee-ticker"
      style={{
        backgroundColor: marqueeConfig?.bgColor || undefined,
        color: marqueeConfig?.textColor || undefined,
      }}
    >
      <div className="marquee-track">
        <div className="marquee-track-group">
          <MarqueeContent items={items} />
        </div>
        <div className="marquee-track-group" aria-hidden="true">
          <MarqueeContent items={items} />
        </div>
      </div>
    </div>
  )
}

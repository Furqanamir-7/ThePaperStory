import { Link } from 'react-router-dom'

function PillLinks({ items, suffix = '', hidden = false }) {
  return items.map((item) => (
    <Link
      key={`${item.key}${suffix}`}
      to={item.to}
      className={`pills-bar-item${item.active ? ' pills-bar-item--active' : ''}`}
      aria-current={hidden ? undefined : item.active ? 'page' : undefined}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      {item.label}
    </Link>
  ))
}

export default function PillsBar({ items, ariaLabel = 'Filter', static: isStatic = false }) {
  if (isStatic) {
    return (
      <nav aria-label={ariaLabel} className="pills-bar">
        <p className="pills-bar-label">Quick filter</p>
        <div className="pills-bar-track-wrap pills-bar-track-wrap--static">
          <div className="pills-bar-scroll pills-bar-scroll--static">
            <PillLinks items={items} />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav aria-label={ariaLabel} className="pills-bar">
      <p className="pills-bar-label">Quick filter</p>
      <div className="pills-bar-track-wrap">
        <div className="pills-bar-fade pills-bar-fade--left" aria-hidden="true" />
        <div className="pills-bar-scroll pills-bar-scroll--marquee">
          <div className="pills-bar-marquee-track">
            <PillLinks items={items} />
            <PillLinks items={items} suffix="-dup" hidden />
          </div>
        </div>
        <div className="pills-bar-fade pills-bar-fade--right" aria-hidden="true" />
      </div>
    </nav>
  )
}

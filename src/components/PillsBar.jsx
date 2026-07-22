import { Link } from 'react-router-dom'

function PillLinks({ items }) {
  return items.map((item) => (
    <Link
      key={item.key}
      to={item.to}
      className={`pills-bar-item${item.active ? ' pills-bar-item--active' : ''}`}
      aria-current={item.active ? 'page' : undefined}
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
        <div className="pills-bar-scroll">
          <PillLinks items={items} />
        </div>
        <div className="pills-bar-fade pills-bar-fade--right" aria-hidden="true" />
      </div>
    </nav>
  )
}

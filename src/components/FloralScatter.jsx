import SimpleFlower from './SimpleFlower'

export default function FloralScatter({ flowers, className = 'floral-scatter' }) {
  return (
    <div className={className} aria-hidden="true">
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className={`floral-piece ${flower.className}${flower.drift ? ' floral-piece--drift' : ''}${flower.reverse ? ' floral-piece--drift-reverse' : ''}`}
        >
          <div className="floral-piece-inner" style={{ transform: `rotate(${flower.rotate})` }}>
            <SimpleFlower />
          </div>
        </div>
      ))}
    </div>
  )
}

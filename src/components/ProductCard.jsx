import { useState } from 'react'

const WHATSAPP_URL =
  'https://wa.me/923144392928?text=Hi!%20I%27d%20like%20to%20know%20more%20about%20The%20Paper%20Story.'

export default function ProductCard({ product }) {
  const [tapped, setTapped] = useState(false)
  const showOverlay = tapped

  return (
    <article className="group flex flex-col">
      <div
        className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-paperstory-blush/30 shadow-sm"
        onClick={() => setTapped(!tapped)}
        onKeyDown={(e) => e.key === 'Enter' && setTapped(!tapped)}
        role="button"
        tabIndex={0}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-300 ${
            showOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <span className="text-sm font-medium text-white">View Details</span>
        </div>
      </div>

      <span className="mb-2 inline-block w-fit rounded-full bg-paperstory-blush px-3 py-1 text-xs font-medium text-paperstory-maroon">
        {product.category}
      </span>

      <h3 className="mb-1 font-serif text-lg font-semibold text-gray-800 transition-colors group-hover:text-paperstory-maroon">
        {product.name}
      </h3>
      <p className="mb-4 text-sm font-medium text-gray-600">{product.price}</p>

      {product.enquireOnly ? (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-btn mt-auto inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2.5 text-center text-xs font-semibold tracking-wide text-white uppercase sm:text-sm"
        >
          Enquire on WhatsApp
        </a>
      ) : (
        <button
          type="button"
          className="gradient-btn mt-auto inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase sm:text-sm"
        >
          Add to Cart
        </button>
      )}
    </article>
  )
}

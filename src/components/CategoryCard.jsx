import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function CategoryCard({ cat, compact = false }) {
  const [imgError, setImgError] = useState(false)

  if (compact) {
    return (
      <Link
        to={`/shop/${cat.slug}#shop-products`}
        className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-paperstory-blush to-paperstory-pale">
          {!imgError && (
            <img
              src={cat.image}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-paperstory-maroon-deep/55 to-transparent" />
        </div>
        <p className="px-3 py-3 text-center text-sm font-semibold text-paperstory-ink group-hover:text-paperstory-maroon">
          {cat.shortLabel}
        </p>
      </Link>
    )
  }

  return (
    <Link
      to={`/shop/${cat.slug}#shop-products`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-gradient-to-br from-paperstory-blush to-paperstory-pale">
        {!imgError && (
          <img
            src={cat.image}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-paperstory-maroon-deep/65 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-serif text-lg font-semibold leading-snug text-paperstory-ink group-hover:text-paperstory-maroon sm:text-xl">
          {cat.label}
        </h3>
        <p className="text-sm leading-relaxed text-paperstory-ink/75">{cat.description}</p>
      </div>
    </Link>
  )
}

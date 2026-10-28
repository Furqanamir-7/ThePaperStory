const sizes = {
  sm: {
    text: 'text-[10px] tracking-[0.16em] sm:text-[11px]',
  },
  nav: {
    text: 'text-[11px] tracking-[0.12em] sm:text-xs md:text-sm',
  },
  md: {
    text: 'text-xs tracking-[0.14em] sm:text-sm',
  },
  lg: {
    text: 'text-xl tracking-[0.1em] sm:text-2xl md:text-3xl lg:text-[2.35rem]',
  },
}

const variants = {
  light: 'text-paperstory-cream',
  dark: 'text-paperstory-maroon',
}

export default function BrandWordmark({ size = 'md', variant = 'dark', className = '' }) {
  const s = sizes[size] ?? sizes.md

  return (
    <span
      className={`inline-block font-sans font-extrabold uppercase leading-none ${s.text} ${variants[variant] ?? variants.dark} ${className}`}
      aria-label="The Paper Story"
    >
      The Paper Story
    </span>
  )
}

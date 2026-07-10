import { useEffect, useRef, useState } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Prefer any intersection — tall mobile sections never reach a high threshold ratio.
    const { threshold = 0, rootMargin = '80px 0px', ...rest } = options

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin, ...rest }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return [ref, isVisible]
}

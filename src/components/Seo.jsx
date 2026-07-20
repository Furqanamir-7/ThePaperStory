import { useEffect, useMemo } from 'react'
import { DEFAULT_OG_IMAGE, absoluteUrl } from '../utils/seo'

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertLink(rel, href, extra = {}) {
  let element = document.head.querySelector(
    `link[rel="${rel}"]${extra.hreflang ? `[hreflang="${extra.hreflang}"]` : ''}`
  )
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
  Object.entries(extra).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  jsonLd = [],
  noindex = false,
}) {
  const canonical = absoluteUrl(path)
  const schemaKey = useMemo(() => JSON.stringify(jsonLd), [jsonLd])
  const schemas = useMemo(() => {
    const list = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []
    return list
  }, [schemaKey])

  useEffect(() => {
    document.title = title

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex,nofollow' : 'index,follow',
    })

    upsertLink('canonical', canonical)
    upsertLink('alternate', canonical, { hreflang: 'x-default' })

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'The Paper Story' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: 'The Paper Story — premium stationery and gifting',
    })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    const existing = document.head.querySelectorAll('script[data-seo-jsonld="true"]')
    existing.forEach((node) => node.remove())

    schemas.forEach((schema, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo-jsonld', 'true')
      script.setAttribute('data-seo-index', String(index))
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })
  }, [title, description, canonical, image, noindex, schemaKey, schemas])

  return null
}

import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getAllSitemapPaths } from '../src/data/products.js'
import { alternatesFor } from '../src/config/locales.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://www.thepaperstory.store'

const priorityForPath = (path) => {
  if (path === '/') return '1.0'
  if (path === '/shop') return '0.9'
  if (path === '/shipping') return '0.85'
  if (path.split('/').length === 3) return '0.85'
  return '0.8'
}

const allPaths = getAllSitemapPaths().sort((a, b) => a.localeCompare(b))

const urls = allPaths
  .map((path) => {
    const alternates = alternatesFor(path)
    const alternateTags = Object.entries(alternates)
      .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
      .join('\n')

    return `  <url>
    <loc>${SITE_URL}${path}</loc>
${alternateTags}
    <changefreq>weekly</changefreq>
    <priority>${priorityForPath(path)}</priority>
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`

const outputPath = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(outputPath, xml, 'utf8')
console.log(`Generated sitemap with ${allPaths.length} URLs + hreflang alternates → public/sitemap.xml`)

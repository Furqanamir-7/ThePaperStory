import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getAllSitemapPaths } from '../src/data/products.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = 'https://www.thepaperstory.store'

const priorityForPath = (path) => {
  if (path === '/') return '1.0'
  if (path === '/shop') return '0.9'
  if (path.split('/').length === 3) return '0.85'
  return '0.8'
}

const paths = getAllSitemapPaths()

const urls = paths
  .sort((a, b) => a.localeCompare(b))
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priorityForPath(path)}</priority>
  </url>`
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const outputPath = resolve(__dirname, '../public/sitemap.xml')
writeFileSync(outputPath, xml, 'utf8')
console.log(`Generated sitemap with ${paths.length} URLs → public/sitemap.xml`)

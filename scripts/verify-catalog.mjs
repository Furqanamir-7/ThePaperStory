import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { products, shopCategories, getProductsByCategory } from '../src/data/products.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

console.log('🔍 Running catalog integrity verification...')

let errors = 0

// 1. Verify that every category produces products (unless explicitly empty)
for (const cat of shopCategories) {
  if (['boxes', 'greeting-cards'].includes(cat.slug)) continue // known placeholders
  const catProds = getProductsByCategory(cat.slug)
  if (!catProds || catProds.length === 0) {
    console.error(`❌ Category [${cat.slug}] has 0 products!`)
    errors++
  }
}

// 2. Verify subcategories for accessories-add-ons
const addonsCat = shopCategories.find((c) => c.slug === 'accessories-add-ons')
if (addonsCat && addonsCat.subcategories) {
  for (const sub of addonsCat.subcategories) {
    const subProds = getProductsByCategory('accessories-add-ons', sub.slug)
    if (!subProds || subProds.length === 0) {
      console.error(`❌ Add-on subcategory [${sub.slug}] has 0 products!`)
      errors++
    }
  }
}

// 3. Verify all product images exist on disk
for (const p of products) {
  const imagesToCheck = p.images?.length ? p.images : [p.image]
  for (const img of imagesToCheck) {
    if (!img) continue
    if (img.startsWith('http://') || img.startsWith('https://')) continue
    const fullPath = path.join(rootDir, 'public', img)
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing image file on disk: ${img} (for ${p.code || p.name})`)
      errors++
    }
  }
}

// 4. Verify all product codes are 100% unique across entire store
const seenCodes = new Map()
for (const p of products) {
  const code = (p.code || p.sku || '').trim()
  if (!code) {
    console.error(`❌ Product without code: ID ${p.id} - ${p.name}`)
    errors++
  } else if (seenCodes.has(code)) {
    console.error(`❌ Duplicate product code detected: ${code} on both ID ${seenCodes.get(code)} and ID ${p.id} (${p.name})`)
    errors++
  } else {
    seenCodes.set(code, p.id)
  }
}

if (errors > 0) {
  console.error(`\n❌ Catalog verification failed with ${errors} error(s)!`)
  process.exit(1)
} else {
  console.log(`✅ Catalog integrity verified successfully: ${products.length} products with ${seenCodes.size} unique codes and valid images.\n`)
}


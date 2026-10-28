import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../public/e-invites/website')
const url = 'https://wedding-invite-sand-eight.vercel.app/'
const outFile = join(outDir, 'website-invitation.png')

mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(2500)

await page.screenshot({
  path: outFile,
  fullPage: false,
})

await browser.close()
console.log(`Saved ${outFile}`)

export const SITE_URL = 'https://www.thepaperstory.store'

export const LOCALES = [
  {
    code: 'en',
    prefix: '',
    hreflang: 'en',
    htmlLang: 'en',
    country: null,
    currency: 'USD',
    currencySymbol: '$',
    label: 'International (USD)',
  },
  {
    code: 'en-pk',
    prefix: '/en-pk',
    hreflang: 'en-PK',
    htmlLang: 'en-PK',
    country: 'PK',
    currency: 'PKR',
    currencySymbol: 'Rs. ',
    label: 'Pakistan (PKR)',
  },
  {
    code: 'en-us',
    prefix: '/en-us',
    hreflang: 'en-US',
    htmlLang: 'en-US',
    country: 'US',
    currency: 'USD',
    currencySymbol: '$',
    label: 'United States (USD)',
  },
  {
    code: 'en-gb',
    prefix: '/en-gb',
    hreflang: 'en-GB',
    htmlLang: 'en-GB',
    country: 'GB',
    currency: 'GBP',
    currencySymbol: '£',
    label: 'United Kingdom (GBP)',
  },
  {
    code: 'en-ae',
    prefix: '/en-ae',
    hreflang: 'en-AE',
    htmlLang: 'en-AE',
    country: 'AE',
    currency: 'AED',
    currencySymbol: 'AED ',
    label: 'UAE (AED)',
  },
  {
    code: 'en-ca',
    prefix: '/en-ca',
    hreflang: 'en-CA',
    htmlLang: 'en-CA',
    country: 'CA',
    currency: 'CAD',
    currencySymbol: 'CA$',
    label: 'Canada (CAD)',
  },
  {
    code: 'en-au',
    prefix: '/en-au',
    hreflang: 'en-AU',
    htmlLang: 'en-AU',
    country: 'AU',
    currency: 'AUD',
    currencySymbol: 'A$',
    label: 'Australia (AUD)',
  },
  {
    code: 'en-eu',
    prefix: '/en-eu',
    hreflang: 'en-EU',
    htmlLang: 'en-EU',
    country: 'EU',
    currency: 'EUR',
    currencySymbol: '€',
    label: 'Europe (EUR)',
  },
]

export const DEFAULT_LOCALE = LOCALES[0]
export const LOCALE_CODES = LOCALES.map((l) => l.code)

export const COUNTRY_ALIASES = {
  us: 'en-us',
  usa: 'en-us',
  uk: 'en-gb',
  gb: 'en-gb',
  pk: 'en-pk',
  pak: 'en-pk',
  ae: 'en-ae',
  uae: 'en-ae',
  ca: 'en-ca',
  can: 'en-ca',
  au: 'en-au',
  aus: 'en-au',
  eu: 'en-eu',
  europe: 'en-eu',
}

export function getLocale(code) {
  if (!code) return DEFAULT_LOCALE
  const clean = String(code).toLowerCase().replace(/^\//, '')
  const resolvedCode = COUNTRY_ALIASES[clean] || clean
  return (
    LOCALES.find(
      (l) =>
        l.code === resolvedCode ||
        l.prefix === `/${resolvedCode}` ||
        (l.country && l.country.toLowerCase() === clean)
    ) || DEFAULT_LOCALE
  )
}

/** Check if a path segment is a country or locale identifier */
export function isCountryOrLocaleRoute(segment) {
  if (!segment) return false
  const clean = String(segment).toLowerCase().replace(/^\//, '')
  return Boolean(
    COUNTRY_ALIASES[clean] ||
    LOCALES.some((l) => l.code === clean || l.prefix === `/${clean}` || (l.country && l.country.toLowerCase() === clean))
  )
}

/** Extract active locale from current browser pathname */
export function getLocaleFromPath(pathname = '/') {
  const segments = String(pathname).split('/').filter(Boolean)
  if (segments.length > 0 && isCountryOrLocaleRoute(segments[0])) {
    return getLocale(segments[0])
  }
  return DEFAULT_LOCALE
}

/** Absolute URL of `path` in a given locale. `path` starts with "/" and has no locale prefix. */
export function localeUrl(locale, path = '/') {
  const clean = path === '/' ? '' : path
  const prefix = locale?.prefix || ''
  return `${SITE_URL}${prefix}${clean}` || `${SITE_URL}/`
}

/** hreflang map for one page: every locale plus x-default. */
export function alternatesFor(path = '/') {
  const map = {}
  for (const l of LOCALES) {
    map[l.hreflang] = localeUrl(l, path)
  }
  map['x-default'] = localeUrl(DEFAULT_LOCALE, path)
  return map
}

// Exchange rates relative to PKR
export const CURRENCY_RATES = {
  PKR: 1,
  USD: 1 / 280,
  EUR: 1 / 300,
  GBP: 1 / 360,
  AED: 1 / 76,
  CAD: 1 / 205,
  AUD: 1 / 185,
}

export function formatPriceCurrency(pkrAmount, currencyCode = 'USD') {
  if (!pkrAmount || isNaN(pkrAmount)) return null
  const num = Number(pkrAmount)
  const target = currencyCode.toUpperCase()

  if (target === 'PKR') {
    return `PKR ${num.toLocaleString('en-PK')}`
  }

  const rate = CURRENCY_RATES[target] || CURRENCY_RATES.USD
  const converted = Math.round(num * rate)
  const loc = LOCALES.find((l) => l.currency === target) || DEFAULT_LOCALE
  return `${loc.currencySymbol}${converted.toLocaleString()} ${target}`
}


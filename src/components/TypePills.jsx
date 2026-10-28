import PillsBar from './PillsBar'

const PRODUCTS_HASH = '#shop-products'

export default function TypePills({ category, subcategory, activeTypeSlug = null }) {
  if (!category || !subcategory?.types?.length) return null

  const base = `/shop/${category.slug}/${subcategory.slug}`

  const items = [
    {
      key: 'all',
      label: 'All',
      to: `${base}${PRODUCTS_HASH}`,
      active: activeTypeSlug === null,
    },
    ...subcategory.types.map((type) => ({
      key: type.slug,
      label: type.label,
      to: `${base}/${type.slug}${PRODUCTS_HASH}`,
      active: activeTypeSlug === type.slug,
    })),
  ]

  return <PillsBar items={items} ariaLabel="Filter by occasion" static />
}

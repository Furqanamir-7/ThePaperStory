import PillsBar from './PillsBar'

const PRODUCTS_HASH = '#shop-products'

export default function SubcategoryPills({ category, activeSubSlug = null }) {
  if (!category?.subcategories?.length) return null

  const items = [
    {
      key: 'all',
      label: 'All',
      to: `/shop/${category.slug}${PRODUCTS_HASH}`,
      active: activeSubSlug === null,
    },
    ...category.subcategories.map((sub) => ({
      key: sub.slug,
      label: sub.label,
      to: `/shop/${category.slug}/${sub.slug}${PRODUCTS_HASH}`,
      active: activeSubSlug === sub.slug,
    })),
  ]

  return <PillsBar items={items} ariaLabel="Filter by subcategory" />
}

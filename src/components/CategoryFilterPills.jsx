import PillsBar from './PillsBar'
import { shopCategories } from '../data/products'

const PRODUCTS_HASH = '#shop-products'

export default function CategoryFilterPills({ activeSlug = null }) {
  const items = [
    {
      key: 'all',
      label: 'All',
      to: '/shop',
      active: activeSlug === null,
    },
    ...shopCategories.map((cat) => ({
      key: cat.id,
      label: cat.shortLabel,
      to: `/shop/${cat.slug}${PRODUCTS_HASH}`,
      active: activeSlug === cat.slug,
    })),
  ]

  return <PillsBar items={items} ariaLabel="Filter by category" />
}

import { PART2_CATEGORY_OPTIONS } from '@/constants'
import CategoryCard from './category-card'

interface CategoryListSectionProps {
  forecastId: string
  forecastSlug: string
}
export default function CategoryListSection({
  forecastSlug,
}: CategoryListSectionProps) {
  const categories = Object.values(PART2_CATEGORY_OPTIONS)

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.value}
            categoryLabel={cat.label}
            categoryValue={cat.value}
            forecastSlug={forecastSlug}
          />
        ))}
      </div>
    </div>
  )
}

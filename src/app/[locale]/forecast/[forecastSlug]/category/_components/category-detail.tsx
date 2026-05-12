'use client'

import { Breadcrumb } from '@/components/breadcumb'
import { Skeleton } from '@/components/ui/skeleton'
import { PART2_CATEGORY_OPTIONS, PART_GROUP } from '@/constants'
import { useForecastQuestionListQuery } from '@/queries'
import route from '@/routes'
import { useParams } from 'next/navigation'
import Part23Section from './part23-section'

export default function CategoryDetail() {
  const { forecastSlug, categorySlug } = useParams<{
    forecastSlug: string
    categorySlug: string
  }>()
  const forecastId = forecastSlug.split('.')[1]

  const categoryItem = Object.values(PART2_CATEGORY_OPTIONS).find(
    (c) => c.value === categorySlug,
  )

  const categoryName = categoryItem?.label || categorySlug

  const { data, isLoading } = useForecastQuestionListQuery({
    enabled: !!categorySlug && !!forecastId,
    params: {
      forecastId: forecastId,
      category: categoryName,
      part: PART_GROUP.PART23,
      limit: 100,
    },
  })

  return (
    <div className='mx-auto space-y-6 px-6 py-6'>
      <Breadcrumb
        items={[
          { label: 'Forecast', href: route.forecast },
          {
            label: forecastSlug.split('.')[0],
            href: `${route.forecast}/${forecastSlug}?part=${PART_GROUP.PART23}`,
          },
          { label: categoryName },
        ]}
      />

      <div className='mb-8'>
        <h1 className='text-foreground text-2xl leading-snug font-semibold'>
          {categoryName}
        </h1>
      </div>

      {isLoading ? (
        <CategoryDetailSkeleton />
      ) : (
        <Part23Section
          questions={data?.data}
          isLoading={isLoading}
          forecastSlug={forecastSlug}
          categorySlug={categorySlug}
        />
      )}
    </div>
  )
}

function CategoryDetailSkeleton() {
  return (
    <div className='space-y-6'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className='space-y-4 rounded-2xl border p-6'>
          <Skeleton className='h-6 w-1/3' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>
      ))}
    </div>
  )
}

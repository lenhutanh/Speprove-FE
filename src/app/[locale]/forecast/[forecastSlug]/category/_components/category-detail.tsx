'use client'

import { Breadcrumb } from '@/components/breadcumb'
import { Skeleton } from '@/components/ui/skeleton'
import { PART2_CATEGORY_OPTIONS, PART_GROUP } from '@/constants'
import { useForecastQuery, useForecastQuestionListQuery } from '@/queries'
import route from '@/routes'
import { notFound, useParams } from 'next/navigation'
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

  const forecastQuery = useForecastQuery(forecastId)
  const forecast = forecastQuery.data?.data

  const { data, isLoading } = useForecastQuestionListQuery({
    enabled: !!categoryItem && !!categorySlug && !!forecastId,
    params: {
      forecastId: forecastId,
      category: categorySlug,
      part: PART_GROUP.PART23,
      page: 1,
      limit: 100,
      sortOrder: 'asc',
    },
  })

  if (!categoryItem) {
    notFound()
  }

  if (forecastQuery.isLoading) return <CategoryDetailSkeleton />

  if (forecastQuery.isError || !forecast) {
    notFound()
  }

  return (
    <div className='mx-auto space-y-6 px-6 py-6'>
      <Breadcrumb
        items={[
          { label: 'Forecast', href: route.forecast },
          {
            label: forecast.name,
            href: `${route.forecast}/${forecastSlug}?part=${PART_GROUP.PART23}`,
          },
          { label: `Part 2 & 3 - ${categoryItem.label}` },
        ]}
      />

      <div className='mb-8'>
        <h1 className='text-foreground text-2xl leading-snug font-semibold'>
          {categoryItem.label}
        </h1>
      </div>

      {isLoading ? (
        <CategoryDetailSkeleton />
      ) : (
        <Part23Section
          questions={data?.data}
          isLoading={isLoading}
          forecastSlug={forecastSlug}
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

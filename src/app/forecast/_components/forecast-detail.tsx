'use client'

import { useParams } from 'next/navigation'
import { useForecastQuery } from '@/queries'
import { Skeleton } from '@/components/ui/skeleton'
import ForecastInfo from './forecast-info'
import { Breadcrumb } from '@/components/breadcumb'
import route from '@/routes'
import TopicListSection from './topic-list'

export default function ForecastDetail() {
  const { forecastSlug } = useParams<{ forecastSlug: string }>()
  const id = forecastSlug.split('.')[1]

  const forecastQuery = useForecastQuery(id)
  const forecast = forecastQuery.data?.data

  if (forecastQuery.isLoading) {
    return <ForecastDetailSkeleton />
  }

  if (!forecast) return null

  return (
    <div className="mx-auto px-6">
      <Breadcrumb items={[
        { label: 'Forecast', href: route.forecast },
        { label: forecastSlug.split('.')[0] },
      ]} />
      <ForecastInfo forecast={forecast} />
      <TopicListSection forecastId={id} forecastSlug={forecastSlug} />
    </div>
  )
}

function ForecastDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

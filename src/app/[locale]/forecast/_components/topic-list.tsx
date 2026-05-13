'use client'

import { AppPagination } from '@/components/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useValidatedParams } from '@/hooks'
import { useForecastTopicListQuery } from '@/queries'
import { forecastDetailQuerySchema } from '@/validations'
import { keepPreviousData } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import TopicCard from './topic-card'

interface TopicListSectionProps {
  forecastId: string
  forecastSlug: string
}

export default function TopicListSection({
  forecastId,
  forecastSlug,
}: TopicListSectionProps) {
  const t = useTranslations('forecast')
  const { page, limit, search } = useValidatedParams(forecastDetailQuerySchema)
  const { data, isLoading } = useForecastTopicListQuery({
    params: {
      forecastId,
      page,
      limit,
      search,
    },
    enabled: !!forecastId,
    placeholderData: keepPreviousData,
  })

  const topics = data?.data ?? []

  if (isLoading) {
    return <TopicListSkeleton />
  }

  if (!topics.length) {
    return (
      <div className='rounded-2xl border-2 border-dashed py-20 text-center'>
        <p className='text-muted-foreground text-sm'>{t('no_topics_yet')}</p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} forecastSlug={forecastSlug} />
        ))}
      </div>

      <AppPagination meta={data?.meta} />
    </div>
  )
}

function TopicListSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className='h-28 rounded-2xl' />
      ))}
    </div>
  )
}

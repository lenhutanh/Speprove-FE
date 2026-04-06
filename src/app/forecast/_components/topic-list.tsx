'use client'

import { Skeleton } from '@/components/ui/skeleton'
import TopicCard from './topic-card'
import { useForecastTopicListQuery } from '@/queries'
import { AppPagination } from '@/components/pagination'

interface TopicListSectionProps {
  forecastId: string
  forecastSlug: string
}

export default function TopicListSection({ forecastId, forecastSlug }: TopicListSectionProps) {
  const topicQuery = useForecastTopicListQuery({
    params: {
      forecastId,
    },
    enabled: !!forecastId,
  })

  const topics = topicQuery.data?.data ?? []

  if (topicQuery.isLoading) {
    return <TopicListSkeleton />
  }

  if (!topics.length) {
    return (
      <div className="py-20 text-center border-2 border-dashed rounded-2xl">
        <p className="text-sm text-muted-foreground">Chưa có chủ đề nào trong bộ Forecast này.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            forecastSlug={forecastSlug}
          />
        ))}
      </div>

      <AppPagination meta={topicQuery.data?.meta} />
    </div>
  )
}

function TopicListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
  )
}
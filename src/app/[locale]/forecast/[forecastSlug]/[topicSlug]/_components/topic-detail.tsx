'use client'

import { Breadcrumb } from '@/components/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { PART_GROUP } from '@/constants'
import { useValidatedParams } from '@/hooks'
import { useForecastQuestionListQuery, useForecastTopicQuery } from '@/queries'
import route from '@/routes'
import { forecastQuestionQuerySchema } from '@/validations'
import { useParams } from 'next/navigation'
import Part1QuestionList from './part1-question-list'

export default function TopicDetail() {
  const { forecastSlug, topicSlug } = useParams<{
    forecastSlug: string
    topicSlug: string
  }>()
  const forecastTopicId = topicSlug.split('.')[1]
  const forecastId = forecastSlug.split('.')[1]

  const { limit, page, sortOrder } = useValidatedParams(
    forecastQuestionQuerySchema,
  )

  const topicQuery = useForecastTopicQuery(forecastTopicId)
  const topic = topicQuery.data?.data

  const { data, isLoading } = useForecastQuestionListQuery({
    enabled: !!topicSlug,
    params: {
      forecastId,
      forecastTopicId,
      part: PART_GROUP.PART1,
      limit,
      page,
      sortOrder,
    },
  })

  if (topicQuery.isLoading) return <TopicDetailSkeleton />
  if (!topic) return null

  return (
    <div className='mx-auto space-y-6 px-6 py-6'>
      <Breadcrumb
        items={[
          { label: 'Forecast', href: route.forecast },
          {
            label: topic.forecast.name,
            href: `${route.forecast}/${forecastSlug}`,
          },
          { label: `Part 1 - ${topic.name}` },
        ]}
      />

      <h1 className='text-foreground text-2xl leading-snug font-semibold'>
        {topic.name}
      </h1>

      <Part1QuestionList
        questions={data?.data}
        isLoading={isLoading}
        forecastSlug={forecastSlug}
        topicSlug={topicSlug}
      />
    </div>
  )
}

function TopicDetailSkeleton() {
  return (
    <div className='mx-auto max-w-330 space-y-6 px-6 py-6'>
      <Skeleton className='h-4 w-20' />
      <div className='space-y-2'>
        <Skeleton className='h-6 w-24' />
        <Skeleton className='h-8 w-2/3' />
        <Skeleton className='h-4 w-1/3' />
      </div>
      <div className='space-y-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-20 rounded-xl' />
        ))}
      </div>
    </div>
  )
}

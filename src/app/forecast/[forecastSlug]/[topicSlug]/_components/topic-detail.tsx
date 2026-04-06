'use client'

import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { useForecastQuestionListQuery, useForecastTopicQuery } from '@/queries'
import TopicDetailHeader from './topic-detail-header'
import { Breadcrumb } from '@/components/breadcumb'
import route from '@/routes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryParams, useValidatedParams } from '@/hooks'
import { forecastQuestionQuerySchema } from '@/validations'
import Part1QuestionList from './part1-question-list'
import Part23Section from './part23-section'

export default function TopicDetail() {
  const { forecastSlug, topicSlug } = useParams<{ forecastSlug: string; topicSlug: string }>()
  const forecastTopicId = topicSlug.split('.')[1]

  const { part, limit, page, sortOrder } = useValidatedParams(forecastQuestionQuerySchema)

  const { setQueryParams } = useQueryParams()

  const topicQuery = useForecastTopicQuery(forecastTopicId)
  const topic = topicQuery.data?.data

  const { data, isLoading } = useForecastQuestionListQuery({
    enabled: !!topicSlug,
    params: {
      forecastTopicId,
      part,
      page,
      limit,
      sortOrder
    },
  })

  if (topicQuery.isLoading) return <TopicDetailSkeleton />
  if (!topic) return null

  const handleTabChange = (value: string) => {
    setQueryParams({ part: value })
  }

  return (
    <div className="mx-auto px-6 space-y-6 py-6">
      <Breadcrumb items={[
        { label: 'Forecast', href: route.forecast },
        { label: forecastSlug.split('.')[0], href: `${route.forecast}/${forecastSlug}` },
        { label: topicSlug.split('.')[0] },
      ]} />

      <TopicDetailHeader topic={topic} forecastSlug={forecastSlug} />

      <Tabs value={String(part)} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="1" className='cursor-pointer'>
              Part 1
            </TabsTrigger>
            <TabsTrigger value="2" className='cursor-pointer'>
              Part 2 & 3
            </TabsTrigger>
          </TabsList>

          {/* <div className="text-sm text-slate-500">
            Toolbar Component
          </div> */}
        </div>

        <TabsContent value='1'>
          <Part1QuestionList questions={data?.data} isLoading={isLoading} forecastSlug={forecastSlug} topicSlug={topicSlug} />
        </TabsContent>

        <TabsContent value='2'>
          <Part23Section questions={data?.data} isLoading={false} forecastSlug={forecastSlug} topicSlug={topicSlug} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TopicDetailSkeleton() {
  return (
    <div className="max-w mx-auto px-6 py-8 space-y-6">
      <Skeleton className="h-4 w-20" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
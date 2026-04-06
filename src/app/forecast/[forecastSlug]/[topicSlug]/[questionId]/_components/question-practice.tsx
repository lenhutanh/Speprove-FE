'use client'

import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { useForecastQuestionQuery } from '@/queries'
import PracticeLeft from './practice-left'
import PracticeRight from './practice-right'
import PracticeBottomBar from './practice-bottom-bar'
import { Breadcrumb } from '@/components/breadcumb'
import route from '@/routes'
import { HEADER_HEIGHT } from '@/constants'

export default function QuestionPractice() {
  const { forecastSlug, topicSlug, questionId } = useParams<{
    forecastSlug: string
    topicSlug: string
    questionId: string
  }>()

  const questionQuery = useForecastQuestionQuery(questionId)
  const question = questionQuery.data?.data

  if (questionQuery.isLoading) return <PracticeSkeleton />
  if (!question) return null

  return (
    <div
      className="flex flex-col mx-auto max-w-[1320px]"
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      <Breadcrumb
        items={[
          { label: 'Forecast', href: route.forecast },
          { label: forecastSlug.split('.')[0], href: `${route.forecast}/${forecastSlug}` },
          {
            label: `Part ${question.part} - ${topicSlug.split('.')[0]}`,
            href: `${route.forecast}/${forecastSlug}/${topicSlug}`,
          },
          { label: question.content },
        ]}
      />

      <div className="flex flex-1 overflow-hidden gap-2 p-2">
        <PracticeLeft question={question} topicSlug={topicSlug} />
        <PracticeRight question={question} />
      </div>

      <PracticeBottomBar
        forecastSlug={forecastSlug}
        topicSlug={topicSlug}
        questionId={questionId}
      />
    </div>
  )
}

function PracticeSkeleton() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden p-2 gap-2">
      <Skeleton className="h-8 w-2/3 rounded-lg" />
      <div className="flex flex-1 gap-2 overflow-hidden">
        <div className="w-[55%] flex flex-col gap-2">
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-full rounded-xl" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-full rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-16 rounded-xl" />
    </div>
  )
}

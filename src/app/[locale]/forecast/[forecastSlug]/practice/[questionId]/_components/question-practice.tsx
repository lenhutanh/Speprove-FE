'use client'

import { Breadcrumb } from '@/components/breadcumb'
import { Skeleton } from '@/components/ui/skeleton'
import { HEADER_HEIGHT } from '@/constants'
import { useForecastQuestionQuery, useGetQuestionAudioQuery } from '@/queries'
import route from '@/routes'
import { useAppPreference } from '@/store'
import { useParams, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import PracticeBottomBar from './practice-bottom-bar'
import PracticeLeft, { LeftTab } from './practice-left'
import PracticeRight from './practice-right'

export default function QuestionPractice() {
  const { forecastSlug, questionId } = useParams<{
    forecastSlug: string
    questionId: string
  }>()

  const searchParams = useSearchParams()
  const source = searchParams.get('source')
  const topicId = searchParams.get('topicId')
  const categoryName = searchParams.get('categoryName')

  const { voiceId } = useAppPreference()
  const [leftTab, setLeftTab] = useState<LeftTab>('question')
  const [historyRefreshSignal, setHistoryRefreshSignal] = useState(0)
  const questionQuery = useForecastQuestionQuery(questionId)
  const question = questionQuery.data?.data
  const questionAudioQuery = useGetQuestionAudioQuery(
    question?.questionId,
    voiceId ?? undefined,
  )
  const questionAudioUrl = questionAudioQuery.data?.data.audioUrl

  if (questionQuery.isLoading) return <PracticeSkeleton />
  if (!question) return null

  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: 'Forecast', href: route.forecast },
    {
      label: forecastSlug.split('.')[0],
      href: `${route.forecast}/${forecastSlug}`,
    },
  ]

  if (source === 'topic' && topicId) {
    breadcrumbItems.push({
      label: `Part 1 - Topic`,
      href: `${route.forecast}/${forecastSlug}/${topicId}`,
    })
  } else if (source === 'category' && categoryName) {
    breadcrumbItems.push({
      label: `Part 2 & 3 - Category`,
      href: `${route.forecast}/${forecastSlug}/category/${categoryName}`,
    })
  }

  breadcrumbItems.push({ label: question.content })

  const handleAttemptCreated = () => {
    setLeftTab('history')
    setHistoryRefreshSignal((signal) => signal + 1)
  }

  return (
    <div
      className='mx-auto flex max-w-[1320px] flex-col'
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      <Breadcrumb items={breadcrumbItems} />

      <div className='flex flex-1 gap-2 overflow-hidden p-2'>
        <PracticeLeft
          question={question}
          audioUrl={questionAudioUrl}
          isAudioLoading={questionAudioQuery.isLoading}
          active={leftTab}
          onActiveChange={setLeftTab}
          refreshSignal={historyRefreshSignal}
        />
        <PracticeRight question={question} />
      </div>

      <PracticeBottomBar
        key={questionId}
        forecastSlug={forecastSlug}
        questionId={questionId}
        part={question.part}
        prev={question.prev!}
        next={question.next!}
        source={source}
        topicId={topicId}
        categoryName={categoryName}
        onAttemptCreated={handleAttemptCreated}
      />
    </div>
  )
}

function PracticeSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-2 overflow-hidden p-2'>
      <Skeleton className='h-8 w-2/3 rounded-lg' />
      <div className='flex flex-1 gap-2 overflow-hidden'>
        <div className='flex w-[55%] flex-col gap-2'>
          <Skeleton className='h-9 rounded-xl' />
          <Skeleton className='h-full rounded-xl' />
        </div>
        <div className='flex flex-1 flex-col gap-2'>
          <Skeleton className='h-9 rounded-xl' />
          <Skeleton className='h-full rounded-xl' />
        </div>
      </div>
      <Skeleton className='h-16 rounded-xl' />
    </div>
  )
}

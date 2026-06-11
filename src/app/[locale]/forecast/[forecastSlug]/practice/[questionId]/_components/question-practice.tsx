'use client'

import { Breadcrumb } from '@/components/breadcumb'
import { Skeleton } from '@/components/ui/skeleton'
import { HEADER_HEIGHT, PART2_CATEGORY_OPTIONS } from '@/constants'
import { useForecastQuestionQuery, useGetQuestionAudioQuery } from '@/queries'
import route from '@/routes'
import { useAppPreference } from '@/store'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import PracticeBottomBar from './practice-bottom-bar'
import PracticeLeft, { LeftTab } from './practice-left'
import PracticeRight from './practice-right'

export default function QuestionPractice() {
  const { questionId } = useParams<{
    questionId: string
  }>()

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

  const resolvedForecastSlug = `${question.forecast.slug}.${question.forecast.id}`
  const topic = question.forecastTopic?.topic
  const categoryValue =
    question.part === 2
      ? question.category
      : question.part === 3 && question.parent?.part === 2
        ? question.parent.category
        : undefined
  const categoryItem = Object.values(PART2_CATEGORY_OPTIONS).find(
    (category) => category.value === categoryValue,
  )
  const contextItem =
    question.part === 1
      ? {
          label: `Part ${question.part} - ${topic!.name}`,
          href: `${route.forecast}/${resolvedForecastSlug}/${topic!.slug}.${question.forecastTopic!.id}`,
        }
      : {
          label: `Part 2 & 3 - ${categoryItem!.label}`,
          href: `${route.forecast}/${resolvedForecastSlug}/category/${categoryValue}`,
        }

  const breadcrumbItems = [
    { label: 'Forecast', href: route.forecast },
    {
      label: question.forecast.name,
      href: `${route.forecast}/${resolvedForecastSlug}`,
    },
    contextItem,
    { label: question.content },
  ]

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
        forecastSlug={resolvedForecastSlug}
        questionId={questionId}
        part={question.part}
        prev={question.prev!}
        next={question.next!}
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

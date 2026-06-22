'use client'

import { Breadcrumb } from '@/components/breadcrumb'
import { Container } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollableTabsList, Tabs, TabsTrigger } from '@/components/ui/tabs'
import { HEADER_HEIGHT, PART2_CATEGORY_OPTIONS } from '@/constants'
import { cn } from '@/lib/utils'
import { useForecastQuestionQuery, useGetQuestionAudioQuery } from '@/queries'
import route from '@/routes'
import { useAppPreference } from '@/store'
import { useTranslations } from 'next-intl'
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
  const tTabs = useTranslations('practice.tabs')
  const [leftTab, setLeftTab] = useState<LeftTab>('question')
  const [rightTab, setRightTab] = useState<'ai' | 'leaderboard'>('leaderboard')
  const [mobileTab, setMobileTab] = useState<LeftTab | 'ai' | 'leaderboard'>(
    'question',
  )
  const [historyRefreshSignal, setHistoryRefreshSignal] = useState(0)

  const handleMobileTabChange = (tab: LeftTab | 'ai' | 'leaderboard') => {
    setMobileTab(tab)
    if (tab === 'question' || tab === 'vocabulary' || tab === 'history') {
      setLeftTab(tab)
    } else {
      setRightTab(tab)
    }
  }

  const handleLeftTabChange = (tab: LeftTab) => {
    setLeftTab(tab)
    setMobileTab(tab)
  }

  const handleRightTabChange = (tab: 'ai' | 'leaderboard') => {
    setRightTab(tab)
    setMobileTab(tab)
  }

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
    setMobileTab('history')
    setHistoryRefreshSignal((signal) => signal + 1)
  }

  const mobileTabs = [
    { key: 'question', label: tTabs('question') },
    { key: 'vocabulary', label: tTabs('vocabulary') },
    { key: 'history', label: tTabs('history') },
    // { key: 'ai', label: tTabs('ai') },
    { key: 'leaderboard', label: tTabs('leaderboard') },
  ]

  return (
    <Container
      className='flex flex-col overflow-hidden'
      contentClassName='flex flex-1 flex-col overflow-hidden'
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      <Breadcrumb items={breadcrumbItems} />

      {/* Mobile Tab Selector */}
      <Tabs
        value={mobileTab}
        onValueChange={(val) => handleMobileTabChange(val as any)}
        className='mb-3 block flex-shrink-0 lg:hidden'
      >
        <ScrollableTabsList variant='default' containerClassName='w-full'>
          {mobileTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className='cursor-pointer px-4 py-1.5 text-sm font-medium'
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </ScrollableTabsList>
      </Tabs>

      <div className='flex flex-1 flex-col gap-2 overflow-hidden lg:flex-row'>
        <PracticeLeft
          question={question}
          audioUrl={questionAudioUrl}
          isAudioLoading={questionAudioQuery.isLoading}
          active={leftTab}
          onActiveChange={handleLeftTabChange}
          refreshSignal={historyRefreshSignal}
          className={cn(
            'flex h-full w-full flex-col lg:w-[60%]',
            ['question', 'vocabulary', 'history'].includes(mobileTab)
              ? 'flex'
              : 'hidden lg:flex',
          )}
        />
        <PracticeRight
          question={question}
          active={rightTab}
          onActiveChange={handleRightTabChange}
          className={cn(
            'flex h-full w-full flex-col lg:flex-1',
            ['ai', 'leaderboard'].includes(mobileTab)
              ? 'flex'
              : 'hidden lg:flex',
          )}
        />
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
    </Container>
  )
}

function PracticeSkeleton() {
  return (
    <Container
      className='flex flex-col overflow-hidden'
      contentClassName='flex flex-1 flex-col overflow-hidden'
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
    >
      <div className='flex flex-1 flex-col gap-2 overflow-hidden'>
        <Skeleton className='h-8 w-2/3 rounded-lg' />
        <div className='flex flex-1 gap-2 overflow-hidden'>
          <div className='flex w-[60%] flex-col gap-2'>
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
    </Container>
  )
}

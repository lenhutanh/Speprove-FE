'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
import { ScrollableTabsList, Tabs, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import { useTranslations } from 'next-intl'
import PracticeHistory from './practice-history'
import VocabularyTab from './vocabulary-tab'

interface PracticeLeftProps {
  question: ForecastQuestionType
  audioUrl?: string
  isAudioLoading?: boolean
  active: LeftTab
  onActiveChange: (tab: LeftTab) => void
  refreshSignal: number
  className?: string
}

export type LeftTab = 'question' | 'history' | 'vocabulary'

export default function PracticeLeft({
  question,
  audioUrl,
  isAudioLoading,
  active,
  onActiveChange,
  refreshSignal,
  className,
}: PracticeLeftProps) {
  const t = useTranslations('practice.tabs')
  const tabs: { key: LeftTab; label: string }[] = [
    { key: 'question', label: t('question') },
    { key: 'vocabulary', label: t('vocabulary') },
    { key: 'history', label: t('history') },
  ]

  return (
    <Tabs
      value={active}
      onValueChange={(val) => onActiveChange(val as LeftTab)}
      className={cn('flex h-full flex-col', className)}
    >
      <ScrollableTabsList
        variant='default'
        containerClassName='hidden lg:block mb-3'
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className='cursor-pointer px-4 py-1.5 text-sm font-medium'
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </ScrollableTabsList>

      <div className='border-border bg-card flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm'>
        <div className='flex-1 overflow-hidden'>
          {active === 'question' && (
            <QuestionTab
              question={question}
              audioUrl={audioUrl}
              isAudioLoading={isAudioLoading}
            />
          )}
          {active === 'vocabulary' && (
            <VocabularyTab questionId={question.questionId} />
          )}
          {active === 'history' && (
            <PracticeHistory refreshSignal={refreshSignal} />
          )}
        </div>
      </div>
    </Tabs>
  )
}

function QuestionTab({
  question,
  audioUrl,
  isAudioLoading,
}: {
  question: ForecastQuestionType
  audioUrl?: string
  isAudioLoading?: boolean
}) {
  const t = useTranslations('practice.question')

  return (
    <div className='h-full overflow-y-auto p-5'>
      <div className='flex items-start gap-3 sm:items-center'>
        <div className='mt-0.5 shrink-0 sm:mt-0'>
          <AudioPlayer
            url={audioUrl}
            loading={isAudioLoading}
            autoPlay={!!audioUrl}
            variant='minimal'
          />
        </div>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          <Badge variant='outline' className='shrink-0 text-xs'>
            Part {question.part}
          </Badge>
          <h2 className='text-foreground text-base leading-relaxed font-semibold'>
            {question.content}
          </h2>
        </div>
      </div>

      {question.part === 2 && question.bulletPoints && (
        <div className='mt-3 space-y-2'>
          <p className='text-sm font-medium italic'>You should say</p>
          <ul className='mt-1 flex flex-col gap-2'>
            {question.bulletPoints.map((cue: string, index: number) => (
              <li
                key={index}
                className='text-foreground flex items-start gap-2 text-sm'
              >
                <span className='text-muted-foreground mt-0.5'>•</span>
                {cue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {question.part === 3 && question.parent && (
        <div className='bg-muted/30 mt-6 rounded-xl border p-4'>
          <p className='text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase'>
            {t('related_part_2_topic')}
          </p>
          <p className='text-foreground text-sm leading-relaxed font-medium italic'>
            {question.parent.content}
          </p>
        </div>
      )}
    </div>
  )
}

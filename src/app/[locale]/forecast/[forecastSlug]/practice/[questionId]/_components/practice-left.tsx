'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
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
}

export type LeftTab = 'question' | 'history' | 'vocabulary'

export default function PracticeLeft({
  question,
  audioUrl,
  isAudioLoading,
  active,
  onActiveChange,
  refreshSignal,
}: PracticeLeftProps) {
  const t = useTranslations('practice.tabs')
  const tabs: { key: LeftTab; label: string }[] = [
    { key: 'question', label: t('question') },
    { key: 'vocabulary', label: t('vocabulary') },
    { key: 'history', label: t('history') },
  ]

  return (
    <div className='border-border bg-card flex w-[55%] flex-col overflow-hidden rounded-xl border shadow-sm'>
      <div className='border-border bg-muted/40 flex flex-shrink-0 border-b'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onActiveChange(tab.key)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              active === tab.key
                ? 'bg-card text-foreground after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-indigo-500'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
      <div className='mb-4 flex items-center gap-2'>
        <Badge variant='secondary' className='text-[11px]'>
          Part {question.part}
        </Badge>
        <span className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
          {/* {topicSlug.split('.')[0]} */}
        </span>
      </div>

      <div className='flex items-center gap-4'>
        <AudioPlayer
          url={audioUrl}
          loading={isAudioLoading}
          autoPlay={!!audioUrl}
          variant='minimal'
        />
        <h2 className='text-foreground text-base leading-relaxed font-semibold'>
          {question.content}
        </h2>
      </div>

      {question.part === 2 && question.bulletPoints && (
        <div className='border-primary border-l-2 pl-4'>
          <p className='text-muted-foreground mb-2.5 text-xs font-medium'>
            You should say:
          </p>
          <ul className='space-y-2'>
            {question.bulletPoints.map((cue: string, index: number) => (
              <li
                key={index}
                className='text-foreground flex items-start gap-2 text-sm'
              >
                <span className='bg-accent-foreground mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full' />
                {cue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {question.part === 3 && question.parent && (
        <div className='rounded-lg border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/20'>
          <p className='mb-1 text-[10px] font-semibold tracking-wider text-indigo-500 uppercase dark:text-indigo-400'>
            {t('related_part_2_topic')}
          </p>
          <p className='text-sm font-medium text-indigo-900 italic dark:text-indigo-200'>
            {question.parent.content}
          </p>
        </div>
      )}
    </div>
  )
}

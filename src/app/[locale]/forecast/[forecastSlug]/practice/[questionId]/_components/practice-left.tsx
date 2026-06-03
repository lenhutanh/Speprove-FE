'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import PracticeHistory from './practice-history'

interface PracticeLeftProps {
  question: ForecastQuestionType
}

type LeftTab = 'question' | 'history'

export default function PracticeLeft({ question }: PracticeLeftProps) {
  const t = useTranslations('practice.tabs')
  const [active, setActive] = useState<LeftTab>('question')
  const tabs: { key: LeftTab; label: string }[] = [
    { key: 'question', label: t('question') },
    { key: 'history', label: t('history') },
  ]

  return (
    <div className='border-border flex w-[55%] flex-col overflow-hidden rounded-xl border bg-white shadow-sm'>
      <div className='border-border bg-muted/40 flex flex-shrink-0 border-b'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              active === tab.key
                ? 'bg-white text-slate-800 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-indigo-500'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-slate-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='flex-1 overflow-hidden'>
        {active === 'question' && <QuestionTab question={question} />}
        {active === 'history' && <PracticeHistory />}
      </div>
    </div>
  )
}

function QuestionTab({ question }: { question: ForecastQuestionType }) {
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
        <AudioPlayer url={question.audioUrl} autoPlay variant='minimal' />
        <h2 className='text-base leading-relaxed font-semibold text-slate-800'>
          {question.content}
        </h2>
      </div>

      {question.part === 2 && question.bulletPoints && (
        <div className='border-primary border-l-2 pl-4'>
          <p className='mb-2.5 text-xs font-medium text-slate-500'>
            You should say:
          </p>
          <ul className='space-y-2'>
            {question.bulletPoints.map((cue: string, index: number) => (
              <li
                key={index}
                className='flex items-start gap-2 text-sm text-slate-700'
              >
                <span className='bg-accent-foreground mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full' />
                {cue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {question.part === 3 && question.parent && (
        <div className='rounded-lg border border-indigo-100 bg-indigo-50 p-3'>
          <p className='mb-1 text-[10px] font-semibold tracking-wider text-indigo-500 uppercase'>
            Related Part 2 Topic
          </p>
          <p className='text-sm font-medium text-indigo-900 italic'>
            {question.parent.content}
          </p>
        </div>
      )}
    </div>
  )
}

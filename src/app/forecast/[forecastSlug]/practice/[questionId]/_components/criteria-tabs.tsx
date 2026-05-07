'use client'

import { cn } from '@/lib/utils'
import { Evaluation, SpeechMetrics } from '@/types'
import { useState } from 'react'
import { TranscriptHighlight } from './transcript-highlight'

type CriteriaTab = 'fluency' | 'pronunciation' | 'lexical' | 'grammar'

interface CriteriaTabsProps {
  evaluation: Evaluation
  speechMetrics: SpeechMetrics
  audioUrl: string
}

function bandColor(band: number) {
  if (band >= 7)
    return {
      pill: 'bg-emerald-50 text-emerald-700',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    }
  if (band >= 6)
    return {
      pill: 'bg-amber-50 text-amber-700',
      badge: 'bg-amber-50 text-amber-700 border-amber-100',
    }
  return {
    pill: 'bg-muted text-muted-foreground',
    badge: 'bg-muted text-muted-foreground border-border',
  }
}

const TAB_LABELS: Record<CriteriaTab, string> = {
  fluency: 'Fluency',
  pronunciation: 'Pron',
  lexical: 'Lexical',
  grammar: 'Grammar',
}

export function CriteriaTabs({
  evaluation,
  speechMetrics,
  audioUrl,
}: CriteriaTabsProps) {
  const [activeTab, setActiveTab] = useState<CriteriaTab>('fluency')

  const tabs: { key: CriteriaTab; band: number | undefined }[] = [
    { key: 'fluency', band: evaluation.fluency?.band },
    { key: 'pronunciation', band: evaluation.pronunciation?.band },
    { key: 'lexical', band: evaluation.lexical?.band },
    { key: 'grammar', band: evaluation.grammar?.band },
  ]

  const activeFeedback = {
    fluency: evaluation.fluency,
    pronunciation: evaluation.pronunciation,
    lexical: evaluation.lexical,
    grammar: evaluation.grammar,
  }[activeTab]

  const colors = bandColor(activeFeedback?.band ?? 0)

  return (
    <div>
      {/* Tab bar */}
      <div className='border-border scrollbar-none flex overflow-x-auto border-b'>
        {tabs.map(({ key, band }) => {
          const isActive = activeTab === key
          const bc = bandColor(band ?? 0)
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                '-mb-px flex flex-shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'border-emerald-500 text-emerald-700'
                  : 'text-muted-foreground hover:text-foreground border-transparent',
              )}
            >
              {TAB_LABELS[key]}
              {band !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-px text-[10px] font-medium',
                    isActive ? bc.pill : 'bg-muted text-muted-foreground',
                  )}
                >
                  {band}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className='bg-background'>
        {/* Transcript with highlights */}
        <div className='border-border border-b px-3 py-2.5'>
          <p className='text-muted-foreground mb-2 text-[10px] font-medium tracking-wide uppercase'>
            Transcript
          </p>
          <TranscriptHighlight
            tab={activeTab}
            evaluation={evaluation}
            speechMetrics={speechMetrics}
            audioUrl={audioUrl}
          />
        </div>

        {/* Feedback */}
        {activeFeedback && (
          <div className='px-3 py-2.5'>
            <p className='text-muted-foreground mb-2 text-[10px] font-medium tracking-wide uppercase'>
              Nhận xét
            </p>
            <div className='flex items-start gap-2.5'>
              <div
                className={cn(
                  'flex h-9 w-9 flex-shrink-0 flex-col items-center justify-center rounded-md border',
                  colors.badge,
                )}
              >
                <span className='text-sm leading-none font-medium'>
                  {activeFeedback.band}
                </span>
                <span className='mt-0.5 text-[9px] tracking-wide uppercase opacity-70'>
                  band
                </span>
              </div>
              <p className='text-muted-foreground pt-0.5 text-sm leading-relaxed'>
                {activeFeedback.feedback}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

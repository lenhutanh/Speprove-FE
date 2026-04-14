'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Evaluation, SpeechMetrics } from '@/types'
import { TranscriptHighlight } from './transcript-highlight'

type CriteriaTab = 'fluency' | 'pronunciation' | 'lexical' | 'grammar'

interface CriteriaTabsProps {
  evaluation: Evaluation
  speechMetrics: SpeechMetrics
  audioUrl: string
}

function bandColor(band: number) {
  if (band >= 7) return { pill: 'bg-emerald-50 text-emerald-700', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
  if (band >= 6) return { pill: 'bg-amber-50 text-amber-700', badge: 'bg-amber-50 text-amber-700 border-amber-100' }
  return { pill: 'bg-muted text-muted-foreground', badge: 'bg-muted text-muted-foreground border-border' }
}

const TAB_LABELS: Record<CriteriaTab, string> = {
  fluency: 'Fluency',
  pronunciation: 'Pron',
  lexical: 'Lexical',
  grammar: 'Grammar',
}

export function CriteriaTabs({ evaluation, speechMetrics, audioUrl }: CriteriaTabsProps) {
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
      <div className="flex border-b border-border overflow-x-auto scrollbar-none">
        {tabs.map(({ key, band }) => {
          const isActive = activeTab === key
          const bc = bandColor(band ?? 0)
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors flex-shrink-0',
                isActive
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {TAB_LABELS[key]}
              {band !== undefined && (
                <span className={cn(
                  'text-[10px] font-medium px-1.5 py-px rounded-full',
                  isActive ? bc.pill : 'bg-muted text-muted-foreground'
                )}>
                  {band}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="bg-background">
        {/* Transcript with highlights */}
        <div className="px-3 py-2.5 border-b border-border">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
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
          <div className="px-3 py-2.5">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Nhận xét
            </p>
            <div className="flex items-start gap-2.5">
              <div className={cn(
                'flex-shrink-0 w-9 h-9 rounded-md border flex flex-col items-center justify-center',
                colors.badge
              )}>
                <span className="text-sm font-medium leading-none">{activeFeedback.band}</span>
                <span className="text-[9px] mt-0.5 opacity-70 uppercase tracking-wide">band</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                {activeFeedback.feedback}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
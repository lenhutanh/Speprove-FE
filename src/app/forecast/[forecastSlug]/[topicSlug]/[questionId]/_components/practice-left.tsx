'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ForecastQuestionType } from '@/types'
import PracticeHistory from './practice-history'
import { AudioPlayer } from '@/components/ui/audio-player'

interface PracticeLeftProps {
  question: ForecastQuestionType
  topicSlug: string
}

type LeftTab = 'question' | 'history'

const TABS: { key: LeftTab; label: string }[] = [
  { key: 'question', label: 'Câu hỏi' },
  { key: 'history', label: 'Lịch sử luyện tập' },
]

export default function PracticeLeft({ question, topicSlug }: PracticeLeftProps) {
  const [active, setActive] = useState<LeftTab>('question')

  return (
    <div className="w-[55%] flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex border-b border-border bg-muted/40 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              'px-4 py-2.5 text-xs font-medium transition-colors relative',
              active === tab.key
                ? 'text-slate-800 bg-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-500'
                : 'text-muted-foreground hover:text-slate-700 hover:bg-muted/60'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {active === 'question' && <QuestionTab question={question} topicSlug={topicSlug} />}
        {active === 'history' && <PracticeHistory />}
      </div>
    </div>
  )
}

function QuestionTab({
  question,
  topicSlug,
}: {
  question: ForecastQuestionType
  topicSlug: string
}) {
  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="text-[11px]">
          Part {question.part}
        </Badge>
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
          {topicSlug.split('.')[0]}
        </span>
      </div>

      <div className='flex gap-2'>
        <AudioPlayer url={question.audioUrl} autoPlay variant="minimal" />
        <h2 className="text-[15px] font-semibold text-slate-800 leading-relaxed mb-5">
          {question.content}
        </h2>
      </div>

      {question.part === 2 && question.bulletPoints && (
        <div className="pl-4 border-l-2 border-primary">
          <p className="text-xs font-medium text-slate-500 mb-2.5">You should say:</p>
          <ul className="space-y-2">
            {question.bulletPoints.map((cue: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-foreground flex-shrink-0" />
                {cue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {question.part === 3 && question.parent && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
          <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mb-1">
            Related Part 2 Topic
          </p>
          <p className="text-sm text-indigo-900 font-medium italic">
            {question.parent.content}
          </p>
        </div>
      )}
    </div>
  )
}

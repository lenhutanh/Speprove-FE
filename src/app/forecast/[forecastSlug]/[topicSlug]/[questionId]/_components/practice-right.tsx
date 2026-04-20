'use client'

import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import { useState } from 'react'
import AIAssistant from './ai-assistant'
import PracticeLeaderboard from './practice-leaderboard'

interface PracticeRightProps {
  question: ForecastQuestionType
}

type RightTab = 'ai' | 'leaderboard'

const TABS: { key: RightTab; label: string }[] = [
  { key: 'ai', label: 'Trợ lý AI' },
  { key: 'leaderboard', label: 'Bảng vàng' },
]

const AI_OPTIONS = [
  { key: 'improve', label: 'Cải thiện câu trả lời' },
  { key: 'vocabulary', label: 'Gợi ý từ vựng nâng cao' },
  { key: 'ideas', label: 'Ý tưởng mở rộng câu trả lời' },
]

export default function PracticeRight({ question }: PracticeRightProps) {
  const [active, setActive] = useState<RightTab>('ai')
  const [loading, setLoading] = useState(false)

  async function handleOption(key: string, label: string) {
    setLoading(true)
  }

  return (
    <div className='border-border flex flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-sm'>
      {/* Tab bar */}
      <div className='border-border bg-muted/40 flex flex-shrink-0 border-b'>
        {TABS.map((tab) => (
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

      {/* Tab content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {active === 'ai' && (
          <AIAssistant
            options={AI_OPTIONS}
            loading={loading}
            onOption={handleOption}
          />
        )}
        {active === 'leaderboard' && (
          <PracticeLeaderboard questionId={question.id} />
        )}
      </div>
    </div>
  )
}

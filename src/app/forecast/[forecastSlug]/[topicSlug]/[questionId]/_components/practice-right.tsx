'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ForecastQuestionType, AIResultType } from '@/types'
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
  const [results, setResults] = useState<AIResultType[]>([])
  const [loading, setLoading] = useState(false)

  async function handleOption(key: string, label: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        body: JSON.stringify({ questionId: question._id, type: key }),
      })
      const data = await res.json()
      setResults((prev) => [{ label, content: data.result }, ...prev])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Tab bar */}
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

      {/* Tab content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {active === 'ai' && (
          <AIAssistant
            results={results}
            options={AI_OPTIONS}
            loading={loading}
            onOption={handleOption}
          />
        )}
        {active === 'leaderboard' && (
          <PracticeLeaderboard questionId={question._id} />
        )}
      </div>
    </div>
  )
}

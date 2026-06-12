'use client'

import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AIAssistant from './ai-assistant'
import PracticeLeaderboard from './practice-leaderboard'

interface PracticeRightProps {
  question: ForecastQuestionType
}

type RightTab = 'ai' | 'leaderboard'

export default function PracticeRight({ question }: PracticeRightProps) {
  const tTabs = useTranslations('practice.tabs')
  const tAI = useTranslations('practice.ai')
  const [active, setActive] = useState<RightTab>('ai')
  const [loading, setLoading] = useState(false)
  const tabs: { key: RightTab; label: string }[] = [
    { key: 'ai', label: tTabs('ai') },
    { key: 'leaderboard', label: tTabs('leaderboard') },
  ]
  const aiOptions = [
    { key: 'improve', label: tAI('improve') },
    { key: 'vocabulary', label: tAI('vocabulary') },
    { key: 'ideas', label: tAI('ideas') },
  ]

  async function handleOption(_key: string, _label: string) {
    setLoading(true)
  }

  return (
    <div className='border-border bg-card flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm'>
      <div className='border-border bg-muted/40 flex flex-shrink-0 border-b'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
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

      <div className='flex flex-1 flex-col overflow-hidden'>
        {active === 'ai' && (
          <AIAssistant
            options={aiOptions}
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

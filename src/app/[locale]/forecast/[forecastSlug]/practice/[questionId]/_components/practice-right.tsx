'use client'

import { cn } from '@/lib/utils'
import { Tabs, ScrollableTabsList, TabsTrigger } from '@/components/ui/tabs'
import { ForecastQuestionType } from '@/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AIAssistant from './ai-assistant'
import PracticeLeaderboard from './practice-leaderboard'

export type RightTab = 'ai' | 'leaderboard'

interface PracticeRightProps {
  question: ForecastQuestionType
  active: RightTab
  onActiveChange: (tab: RightTab) => void
  className?: string
}

export default function PracticeRight({
  question,
  active,
  onActiveChange,
  className,
}: PracticeRightProps) {
  const tTabs = useTranslations('practice.tabs')
  const tAI = useTranslations('practice.ai')
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
    <Tabs
      value={active}
      onValueChange={(val) => onActiveChange(val as RightTab)}
      className={cn('flex flex-col h-full', className)}
    >
      <ScrollableTabsList
        variant='default'
        containerClassName='hidden lg:block mb-3'
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className='px-4 py-1.5 text-sm font-medium cursor-pointer'
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </ScrollableTabsList>

      <div className='border-border bg-card flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm'>
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
    </Tabs>
  )
}

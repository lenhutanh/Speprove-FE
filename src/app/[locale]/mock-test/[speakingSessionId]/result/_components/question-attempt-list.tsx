'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SpeakingSessionAttempt } from '@/types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { QuestionAttemptItem } from './question-attempt-item'

interface QuestionAttemptListProps {
  attempts: SpeakingSessionAttempt[]
}

export function QuestionAttemptList({ attempts }: QuestionAttemptListProps) {
  const t = useTranslations('mock_test.result')

  const availableParts = Array.from(new Set(attempts.map((a) => a.part))).sort(
    (a, b) => a - b,
  )

  const [activeTab, setActiveTab] = useState<string>(
    String(availableParts[0] || 1),
  )

  const [openAttemptId, setOpenAttemptId] = useState<string | null>(null)

  if (attempts.length === 0) {
    return null
  }

  const filteredAttempts = attempts
    .filter((a) => String(a.part) === activeTab)
    .sort((a, b) => a.order - b.order)

  const showTabs = availableParts.length > 1

  return (
    <div className='bg-card border-border space-y-4 rounded-xl border p-4 transition-all sm:p-5'>
      {showTabs && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList
            className='border-border/80 scrollbar-none h-auto w-full justify-start gap-2 overflow-x-auto rounded-none border-b bg-transparent p-0 whitespace-nowrap'
            variant='line'
          >
            {availableParts.map((part) => (
              <TabsTrigger
                key={part}
                value={String(part)}
                className='data-[state=active]:border-foreground flex-initial rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm font-semibold shadow-none transition-all hover:bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              >
                Part {part}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className='flex items-center justify-between py-1'>
        <span className='text-muted-foreground text-xs font-bold tracking-wider uppercase sm:text-xs'>
          {t('questions_count', { count: String(filteredAttempts.length) })}
        </span>
      </div>

      <div className='flex flex-col gap-3'>
        {filteredAttempts.map((attempt, index) => (
          <QuestionAttemptItem
            key={attempt.id}
            attempt={attempt}
            index={index + 1}
            isOpen={openAttemptId === attempt.id}
            onOpenChange={(open) => setOpenAttemptId(open ? attempt.id : null)}
          />
        ))}
      </div>
    </div>
  )
}

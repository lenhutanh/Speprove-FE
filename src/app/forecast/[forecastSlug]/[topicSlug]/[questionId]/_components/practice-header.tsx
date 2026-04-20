'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'

interface PracticeHeaderProps {
  question: ForecastQuestionType
  forecastSlug: string
  topicSlug: string
  current?: number
  total?: number
}

const PART_CONFIG = {
  1: {
    label: 'Part 1',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  2: {
    label: 'Part 2',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  3: {
    label: 'Part 3',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
} as const

export default function PracticeHeader({
  question,
  forecastSlug,
  topicSlug,
  current,
  total,
}: PracticeHeaderProps) {
  const cfg = PART_CONFIG[question.part]

  return (
    <header className='border-border bg-background flex flex-shrink-0 items-center justify-between border-b px-4 py-2.5'>
      <div className='flex items-center gap-2'>
        <Badge
          variant='secondary'
          className={cn('border text-xs', cfg.badgeClass)}
        >
          {cfg.label}
        </Badge>
        <span className='text-foreground text-sm font-medium'>
          {question.content}
        </span>
      </div>

      {current && total ? (
        <span className='text-muted-foreground text-xs'>
          {current} / {total} câu
        </span>
      ) : (
        <div className='w-16' />
      )}
    </header>
  )
}

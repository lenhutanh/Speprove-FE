'use client'

import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ForecastQuestionType } from '@/types'
import { Breadcrumb } from '@/components/breadcumb'

interface PracticeHeaderProps {
  question: ForecastQuestionType
  forecastSlug: string
  topicSlug: string
  current?: number
  total?: number
}

const PART_CONFIG = {
  1: { label: 'Part 1', badgeClass: 'bg-violet-50 text-violet-700 border-violet-200' },
  2: { label: 'Part 2', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  3: { label: 'Part 3', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
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
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background flex-shrink-0">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className={cn('text-xs border', cfg.badgeClass)}>
          {cfg.label}
        </Badge>
        <span className="text-sm font-medium text-foreground">{question.content}</span>
      </div>

      {current && total ? (
        <span className="text-xs text-muted-foreground">{current} / {total} câu</span>
      ) : (
        <div className="w-16" />
      )}
    </header>
  )
}
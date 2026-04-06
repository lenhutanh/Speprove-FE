'use client'

import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ForecastTopicType } from '@/types'

interface TopicDetailHeaderProps {
  topic: ForecastTopicType
  forecastSlug: string
}

const PART_CONFIG = {
  1: { label: 'Part 1', badgeClass: 'bg-violet-50 text-violet-700 border-violet-200' },
  2: { label: 'Part 2 + 3', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  3: { label: 'Part 2 + 3', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
} as const

export default function TopicDetailHeader({ topic, forecastSlug }: TopicDetailHeaderProps) {
  const { name, part, questionCount, practicedCount = 0 } = topic
  // const cfg = PART_CONFIG[part]

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Badge
          variant="secondary"
          // className={cn('text-xs font-medium border', cfg.badgeClass)}
        >
          {/* {cfg.label} */}
        </Badge>
        <h1 className="text-2xl font-semibold text-foreground leading-snug">{name}</h1>
        <p className="text-sm text-muted-foreground">
          {/* {questionCount} câu · {practicedCount} đã luyện */}
        </p>
      </div>
    </div>
  )
}
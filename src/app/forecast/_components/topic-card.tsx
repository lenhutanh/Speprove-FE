'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ForecastTopicType } from '@/types'
import route from '@/routes'

interface TopicCardProps {
  topic: ForecastTopicType
  forecastSlug: string
}

export default function TopicCard({ topic, forecastSlug }: TopicCardProps) {
  return (
    <Link
      href={`${route.forecast}/${forecastSlug}/${topic.slug}.${topic.id}`}
      className={cn(
        'group flex items-center justify-between gap-4 rounded-xl border bg-card p-4',
        'transition-all duration-200 hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm'
      )}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {topic.name}
        </h3>
        {/* <p className="text-[11px] text-muted-foreground mt-0.5">
          Nhấn để xem các câu hỏi
        </p> */}
      </div>

      <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
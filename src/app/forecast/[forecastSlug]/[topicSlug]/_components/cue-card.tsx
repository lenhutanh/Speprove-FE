'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ForecastQuestionType } from '@/types' // Nhớ dùng đúng Type

interface CueCardProps {
  cueCard: ForecastQuestionType
  index: number
  discussions: ForecastQuestionType[]
  forecastSlug: string
  topicSlug: string
}

export default function CueCard({ cueCard, index, discussions, forecastSlug, topicSlug }: CueCardProps) {
  const [discussionOpen, setDiscussionOpen] = useState(false)
  const isPracticed = !!cueCard.practicedAt

  const hrefP2 = `/forecast/${forecastSlug}/${topicSlug}/${cueCard.id}`

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden shadow-sm transition-all')}>
      <div className="flex items-start justify-between gap-4 p-5 group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
              Part 2
            </Badge>
            {cueCard.category && (
              <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-md">
                {cueCard.category}
              </span>
            )}
          </div>

          <p className="font-bold leading-relaxed">
            {cueCard.content}
          </p>
        </div>

        <Button asChild size="sm" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
          <Link href={hrefP2}>
            {isPracticed ? 'Luyện lại' : 'Luyện ngay'}
          </Link>
        </Button>
      </div>

      {discussions.length > 0 && (
        <button
          onClick={() => setDiscussionOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 border-t border-border bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
              Part 3
            </Badge>
            <span className="text-sm font-medium text-slate-700">
              Discussion Questions
            </span>

            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden ml-2">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((discussions.filter(d => d.practicedAt).length / discussions.length) * 100)}%`
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {discussions.filter(d => d.practicedAt).length}/{discussions.length}
            </span>
          </div>
          <ChevronRight className={cn('w-4 h-4 text-muted-foreground transition-transform', discussionOpen && 'rotate-90')} />
        </button>
      )}

      {discussionOpen && (
        <div className="divide-y divide-border border-t border-border bg-white">
          {discussions.map((q, i) => (
            <div key={q.id} className="flex items-center justify-between gap-4 px-5 py-4 group hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-sm font-medium">{i + 1}.</span>
                <div>
                  <p className="text-sm text-slate-800 font-medium leading-snug">{q.content}</p>
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0 h-8 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                <Link href={`/forecast/${forecastSlug}/${topicSlug}/${q.id}`}>
                  {q.practicedAt ? 'Luyện lại' : 'Luyện ngay'}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
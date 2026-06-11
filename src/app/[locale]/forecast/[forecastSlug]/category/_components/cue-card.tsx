'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface CueCardProps {
  cueCard: Extract<ForecastQuestionType, { part: 2 }>
  discussions: ForecastQuestionType[]
  forecastSlug: string
}

export default function CueCard({
  cueCard,
  discussions,
  forecastSlug,
}: CueCardProps) {
  const [discussionOpen, setDiscussionOpen] = useState(false)
  const isPracticed = !!cueCard.practicedAt

  const getPracticeUrl = (questionId: string) =>
    `/forecast/${forecastSlug}/practice/${questionId}`

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border shadow-sm transition-all',
      )}
    >
      <div className='group flex items-start justify-between gap-4 p-5'>
        <div className='min-w-0 flex-1'>
          <div className='mb-3 flex items-center gap-2'>
            <Badge
              variant='secondary'
              className='border-orange-200 bg-orange-100 text-orange-800'
            >
              Part 2
            </Badge>
            {cueCard.category && (
              <span className='text-muted-foreground rounded-md bg-slate-100 px-2 py-0.5 text-xs'>
                {cueCard.category}
              </span>
            )}
          </div>

          <p className='leading-relaxed font-bold'>{cueCard.content}</p>
        </div>

        <Button
          asChild
          size='sm'
          className='shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100'
        >
          <Link href={getPracticeUrl(cueCard.id)}>
            {isPracticed ? 'Luyện lại' : 'Luyện ngay'}
          </Link>
        </Button>
      </div>

      {discussions.length > 0 && (
        <button
          onClick={() => setDiscussionOpen((v) => !v)}
          className='border-border flex w-full items-center justify-between border-t bg-slate-50 px-5 py-3 transition-colors hover:bg-slate-100'
        >
          <div className='flex items-center gap-3'>
            <Badge
              variant='secondary'
              className='border border-indigo-200 bg-indigo-50 text-[10px] text-indigo-700'
            >
              Part 3
            </Badge>
            <span className='text-sm font-medium text-slate-700'>
              Discussion Questions
            </span>

            <div className='ml-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-200'>
              <div
                className='h-full rounded-full bg-indigo-500 transition-all duration-500'
                style={{
                  width: `${Math.round((discussions.filter((d) => d.practicedAt).length / discussions.length) * 100)}%`,
                }}
              />
            </div>
            <span className='text-muted-foreground text-xs font-medium'>
              {discussions.filter((d) => d.practicedAt).length}/
              {discussions.length}
            </span>
          </div>
          <ChevronRight
            className={cn(
              'text-muted-foreground h-4 w-4 transition-transform',
              discussionOpen && 'rotate-90',
            )}
          />
        </button>
      )}

      {discussionOpen && (
        <div className='divide-border border-border divide-y border-t bg-white'>
          {discussions.map((q, i) => (
            <div
              key={q.id}
              className='group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50'
            >
              <div className='flex min-w-0 flex-1 items-start gap-3'>
                <span className='text-sm font-medium'>{i + 1}.</span>
                <div>
                  <p className='text-sm leading-snug font-medium text-slate-800'>
                    {q.content}
                  </p>
                </div>
              </div>
              <Button
                asChild
                size='sm'
                className='h-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100'
              >
                <Link href={getPracticeUrl(q.id)}>
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

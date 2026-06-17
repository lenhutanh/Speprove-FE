'use client'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
  const tCommon = useTranslations('common')
  const [discussionOpen, setDiscussionOpen] = useState(false)
  const isPracticed = !!cueCard.practicedAt

  const getPracticeUrl = (questionId: string) =>
    `/forecast/${forecastSlug}/practice/${questionId}`

  return (
    <div className='flex flex-col gap-0'>
      <Link
        href={getPracticeUrl(cueCard.id)}
        className={cn(
          'group bg-card flex cursor-pointer items-start justify-between gap-4 border transition-all hover:shadow-sm',
          isPracticed
            ? 'border-emerald-200'
            : 'border-border hover:border-primary/40',
          discussions.length > 0
            ? 'rounded-t-xl rounded-b-none border-b'
            : 'rounded-xl',
          'px-4 py-4',
        )}
      >
        <div className='min-w-0 flex-1'>
          <div className='mb-3 flex items-center gap-2'>
            <Badge
              variant='secondary'
              className='border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-400'
            >
              Part 2
            </Badge>
            {cueCard.category && (
              <span className='text-muted-foreground dark:bg-muted rounded-md bg-slate-100 px-2 py-0.5 text-xs'>
                {cueCard.category}
              </span>
            )}
          </div>

          <p className='text-foreground text-sm leading-relaxed font-bold'>
            {cueCard.content}
          </p>
        </div>

        <div
          className={cn(
            buttonVariants({
              variant: isPracticed ? 'outline' : 'default',
              size: 'sm',
            }),
            'hidden shrink-0 transition-opacity duration-200 focus-within:opacity-100 xl:inline-flex xl:opacity-0 xl:group-hover:opacity-100',
          )}
        >
          {isPracticed ? tCommon('practice_again') : tCommon('practice_now')}
        </div>
      </Link>

      {discussions.length > 0 && (
        <button
          onClick={() => setDiscussionOpen((v) => !v)}
          className={cn(
            'border-border dark:bg-muted/40 dark:hover:bg-muted flex w-full items-center justify-between border-x border-b bg-slate-50 px-5 py-3 transition-colors hover:bg-slate-100',
            discussionOpen ? 'rounded-none border-b-0' : 'rounded-b-xl',
          )}
        >
          <div className='flex items-center gap-3'>
            <Badge
              variant='secondary'
              className='border border-indigo-200 bg-indigo-50 text-xs text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300'
            >
              Part 3
            </Badge>
            <span className='text-foreground text-sm font-medium'>
              Discussion Questions
            </span>

            <div className='dark:bg-muted ml-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-200'>
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
        <div className='divide-border border-border bg-card divide-y overflow-hidden rounded-b-xl border-x border-b'>
          {discussions.map((q, i) => (
            <Link
              key={q.id}
              href={getPracticeUrl(q.id)}
              className='group dark:hover:bg-muted/50 flex items-center justify-between gap-4 px-5 py-4 transition-colors last:rounded-b-xl hover:bg-slate-50'
            >
              <div className='flex min-w-0 flex-1 items-start gap-3'>
                <span className='text-sm font-medium'>{i + 1}.</span>
                <div>
                  <p className='text-foreground text-sm leading-snug font-medium'>
                    {q.content}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  buttonVariants({
                    variant: q.practicedAt ? 'outline' : 'default',
                    size: 'sm',
                  }),
                  'hidden h-8 shrink-0 transition-opacity duration-200 focus-within:opacity-100 xl:inline-flex xl:opacity-0 xl:group-hover:opacity-100',
                )}
              >
                {q.practicedAt
                  ? tCommon('practice_again')
                  : tCommon('practice_now')}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

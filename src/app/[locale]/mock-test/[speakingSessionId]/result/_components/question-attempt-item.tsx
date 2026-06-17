'use client'

import { AttemptDetailTabs } from '@/app/[locale]/forecast/[forecastSlug]/practice/[questionId]/_components/attempt-detail-tabs'
import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useAttemptQuery } from '@/queries'
import { SpeakingSessionAttempt } from '@/types'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface QuestionAttemptItemProps {
  attempt: SpeakingSessionAttempt
  index: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function getScoreBadgeColor(score: number | null | undefined) {
  if (score === null || score === undefined || score === 0) {
    return 'border-border bg-muted/50 text-muted-foreground dark:border-border/50'
  }
  if (score >= 7.0) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400'
  }
  if (score >= 6.0) {
    return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400'
  }
  return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400'
}

export function QuestionAttemptItem({
  attempt,
  index,
  isOpen,
  onOpenChange,
}: QuestionAttemptItemProps) {
  const t = useTranslations('practice.history')

  const isCompleted = attempt.status === 2
  const isFailed = attempt.status === 3

  const { data: detailRes, isLoading: isDetailLoading } = useAttemptQuery(
    attempt.id,
    {
      enabled: isOpen && isCompleted,
    },
  )

  const detail = detailRes?.data
  const score = attempt.scores?.overall

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border transition-all duration-200',
        isOpen
          ? 'border-foreground/45 bg-muted/5/30'
          : 'border-border/60 bg-background hover:bg-muted/10',
      )}
    >
      <button
        onClick={() => onOpenChange(!isOpen)}
        className={cn(
          'focus-visible:bg-muted/30 flex w-full items-center justify-between px-4 py-4.5 text-left transition-colors outline-none',
          isOpen ? 'bg-muted/10' : 'bg-transparent',
        )}
        style={{ borderRadius: isOpen ? '12px 12px 0 0' : undefined }}
      >
        <div className='flex items-start gap-3.5 pr-4'>
          <span className='text-muted-foreground/80 min-w-[16px] pt-0.5 text-right text-sm font-bold select-none'>
            {index}
          </span>
          <span className='text-foreground text-sm leading-relaxed font-medium sm:text-base'>
            {attempt.question.content}
          </span>
        </div>

        <div className='flex shrink-0 items-center gap-3'>
          {isCompleted && score !== undefined && (
            <Badge
              variant='outline'
              className={cn(
                'rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
                getScoreBadgeColor(score),
              )}
            >
              Band {score ? score.toFixed(1) : '—'}
            </Badge>
          )}

          {!isCompleted && (
            <Badge
              variant='outline'
              className='rounded-md border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-400'
            >
              {isFailed ? t('status_failed') : t('status_processing')}
            </Badge>
          )}

          {isOpen ? (
            <ChevronUp className='text-muted-foreground/80 size-4' />
          ) : (
            <ChevronDown className='text-muted-foreground/80 size-4' />
          )}
        </div>
      </button>

      {isOpen && (
        <div className='border-border/60 bg-muted/5/40 border-t pb-2'>
          {attempt.audioUrl && (
            <div className='border-border/50 bg-muted/15/30 border-b px-4 py-3 sm:px-5'>
              <AudioPlayer url={attempt.audioUrl} variant='full' />
            </div>
          )}

          {isCompleted && (
            <div className='px-1 py-1'>
              {isDetailLoading && (
                <div className='text-muted-foreground flex items-center justify-center gap-2 px-4 py-6 text-sm'>
                  <Loader2 className='size-4 animate-spin text-indigo-500' />
                  <span>{t('loading_analysis')}</span>
                </div>
              )}

              {!isDetailLoading && detail && (
                <AttemptDetailTabs detail={detail} />
              )}

              {!isDetailLoading && !detail && (
                <div className='text-muted-foreground px-4 py-6 text-center text-sm'>
                  {t('empty_detail')}
                </div>
              )}
            </div>
          )}

          {!isCompleted && (
            <div className='text-muted-foreground px-4 py-6 text-center text-sm'>
              {isFailed
                ? 'Chấm điểm thất bại cho câu này.'
                : 'Đang chấm điểm...'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { AttemptDetailTabs } from '@/app/[locale]/forecast/[forecastSlug]/practice/[questionId]/_components/attempt-detail-tabs'
import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
import { BAND_SCORE_BADGE_VARIANTS } from '@/constants'
import { cn, getBandScoreMeta } from '@/lib'
import { useAttemptQuery } from '@/queries'
import { SpeakingSessionAttempt } from '@/types'
import { AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface QuestionAttemptItemProps {
  attempt: SpeakingSessionAttempt
  index: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
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
  const bandScoreMeta = getBandScoreMeta(score)

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
                'rounded-md px-2 py-0.5 text-sm font-bold whitespace-nowrap',
                BAND_SCORE_BADGE_VARIANTS[bandScoreMeta.variant],
              )}
            >
              Band {score ? score.toFixed(1) : '—'}
            </Badge>
          )}

          {!isCompleted && (
            <Badge
              variant='outline'
              className={cn(
                'gap-1 rounded-md px-2 py-0.5 text-sm font-normal whitespace-nowrap',
                isFailed
                  ? 'border-destructive text-destructive bg-transparent'
                  : 'border-border text-muted-foreground bg-transparent',
              )}
            >
              {isFailed ? (
                <AlertCircle className='size-3.5' />
              ) : (
                <Loader2 className='size-3.5 animate-spin' />
              )}
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
            <div className='bg-muted/15/30 px-4 py-3 sm:px-5'>
              <AudioPlayer url={attempt.audioUrl} variant='full' />
            </div>
          )}

          {isCompleted && (
            <>
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
            </>
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

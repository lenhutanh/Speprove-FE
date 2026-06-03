'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { cn } from '@/lib/utils'
import { useGetWordAudioQuery } from '@/queries'
import { AttemptWordAssessment } from '@/types'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PauseIssue, RangeIssue } from './attempt-detail-types'

function scorePillClass(score?: number) {
  if (score == null) return 'bg-muted text-muted-foreground'
  if (score < 75) return 'bg-red-50 text-red-700'
  if (score < 85) return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

export function PronunciationPopover({
  attemptId,
  isOpen,
  word,
  audioUrl,
}: {
  attemptId: string
  isOpen: boolean
  word: AttemptWordAssessment
  audioUrl?: string
}) {
  const t = useTranslations('practice.attempt.popover')
  const { data: expectedAudioRes, isLoading: isExpectedAudioLoading } =
    useGetWordAudioQuery({
      id: attemptId,
      enabled: isOpen,
      params: { wordIndex: word.wordIndex },
    })
  const expectedAudioUrl = expectedAudioRes?.data.audioUrl

  return (
    <div className='space-y-2.5'>
      <div className='flex items-center justify-between gap-2'>
        <span className='text-foreground text-sm font-medium'>{word.word}</span>
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
            scorePillClass(word.accuracyScore),
          )}
        >
          {word.accuracyScore ?? '-'}
        </span>
      </div>

      <div className='text-muted-foreground space-y-2 text-xs'>
        {word.expectedIpa && (
          <div className='flex items-center justify-between'>
            <div>
              {t('expected')}:{' '}
              <span className='text-foreground font-mono'>
                /{word.expectedIpa}/
              </span>
            </div>
            <AudioPlayer
              url={expectedAudioUrl}
              variant='minimal'
              iconVariant='volume'
              className={cn(isExpectedAudioLoading && 'opacity-50')}
            />
          </div>
        )}
        {word.spokenIpa && (
          <div className='flex items-center justify-between'>
            <div>
              {t('spoken')}:{' '}
              <span className='text-foreground font-mono'>
                /{word.spokenIpa}/
              </span>
            </div>
            {audioUrl && word.startTime != null && word.endTime != null && (
              <AudioPlayer
                url={audioUrl}
                variant='minimal'
                iconVariant='volume'
                startTime={word.startTime}
                endTime={word.endTime}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function FluencyPopover({ pause }: { pause: PauseIssue }) {
  const t = useTranslations('practice.attempt.popover')

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between gap-2'>
        <span className='text-foreground text-sm font-medium'>
          {t('pause')}
        </span>
        {pause.duration != null && (
          <span className='rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700'>
            {pause.duration.toFixed(2)}s
          </span>
        )}
      </div>
    </div>
  )
}

export function RangeIssuePopover({ issue }: { issue: RangeIssue }) {
  const suggestion = issue.suggestion ?? issue.correction

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        {suggestion && (
          <>
            <ArrowRight size={16} />
            <span className='text-sm font-medium text-emerald-700'>
              {suggestion}
            </span>
          </>
        )}
      </div>
      {issue.feedback && (
        <div className='border-border border-t pt-2'>
          <p className='text-muted-foreground text-xs leading-relaxed'>
            {issue.feedback}
          </p>
        </div>
      )}
    </div>
  )
}

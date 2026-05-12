'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToggleShareMutation } from '@/queries'
import { AttemptResponseDto } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronDown, ChevronRight, Globe, Lock } from 'lucide-react'
import { useState } from 'react'
import { CriteriaTabs } from './criteria-tabs'

interface HistoryItemProps {
  history: AttemptResponseDto
}

export default function HistoryItem({ history }: HistoryItemProps) {
  const [open, setOpen] = useState(false)
  const toggleShareMutation = useToggleShareMutation()
  const queryClient = useQueryClient()

  const { audioUrl, evaluation, speechMetrics, createdAt } = history
  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: vi,
  })

  const overall = evaluation?.overall
  const overallColor =
    overall != null && overall >= 7
      ? { dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700' }
      : overall != null && overall >= 6
        ? { dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700' }
        : { dot: 'bg-muted-foreground', pill: 'bg-muted text-muted-foreground' }

  const onToggleShare = () => {
    toggleShareMutation.mutate(
      { id: history.id, isPublic: !history.isPublic },
      {
        onSuccess: (res) => {
          if (res.success) {
            queryClient.invalidateQueries({
              queryKey: [
                'attempt-list',
                { forecastQuestionId: history.forecastQuestionId },
              ],
            })
          }
        },
      },
    )
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border',
        open ? 'border-border' : 'border-border/60',
      )}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className='bg-background hover:bg-muted/40 flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors'
        style={{ borderRadius: open ? '8px 8px 0 0' : undefined }}
      >
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'h-2 w-2 flex-shrink-0 rounded-full',
              overallColor.dot,
            )}
          />
          <span className='text-muted-foreground text-sm'>{timeAgo}</span>
          {overall != null && (
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-sm font-medium',
                overallColor.pill,
              )}
            >
              Band {overall}
            </span>
          )}
        </div>
        <div className='flex items-center gap-4'>
          <Badge
            variant={history.isPublic ? 'default' : 'secondary'}
            className='cursor-pointer gap-1 rounded-full'
            onClick={(e) => {
              e.stopPropagation()
              onToggleShare()
            }}
          >
            {history.isPublic ? (
              <Globe className='h-3 w-3' />
            ) : (
              <Lock className='h-3 w-3' />
            )}
            {history.isPublic ? 'Public' : 'Private'}
          </Badge>
          {open ? (
            <ChevronDown className='text-muted-foreground h-3.5 w-3.5' />
          ) : (
            <ChevronRight className='text-muted-foreground h-3.5 w-3.5' />
          )}
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className='border-border border-t'>
          {/* Audio */}
          <div className='border-border bg-muted/20 border-b px-3 py-2'>
            <AudioPlayer url={audioUrl!} variant='full' />
          </div>

          {/* Criteria tabs */}
          {evaluation && speechMetrics && (
            <CriteriaTabs
              evaluation={evaluation}
              speechMetrics={speechMetrics}
              audioUrl={audioUrl!}
            />
          )}
        </div>
      )}
    </div>
  )
}

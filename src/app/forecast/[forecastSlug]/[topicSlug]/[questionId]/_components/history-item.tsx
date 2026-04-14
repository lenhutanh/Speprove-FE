'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { AttemptResponseDto } from '@/types'
import { AudioPlayer } from '@/components/ui/audio-player'
import { CriteriaTabs } from './criteria-tabs'

interface HistoryItemProps {
  history: AttemptResponseDto
}

export default function HistoryItem({ history }: HistoryItemProps) {
  const [open, setOpen] = useState(false)

  const { audioUrl, evaluation, speechMetrics, createdAt } = history
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: vi })

  const overall = evaluation?.overall
  const overallColor =
    overall != null && overall >= 7
      ? { dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700' }
      : overall != null && overall >= 6
        ? { dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700' }
        : { dot: 'bg-muted-foreground', pill: 'bg-muted text-muted-foreground' }

  return (
    <div className={cn(
      'border rounded-lg overflow-hidden',
      open ? 'border-border' : 'border-border/60'
    )}>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-background hover:bg-muted/40 transition-colors rounded-lg"
        style={{ borderRadius: open ? '8px 8px 0 0' : undefined }}
      >
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full flex-shrink-0', overallColor.dot)} />
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {overall != null && (
            <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', overallColor.pill)}>
              Band {overall}
            </span>
          )}
        </div>
        {open
          ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        }
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-border">
          {/* Audio */}
          <div className="px-3 py-2 border-b border-border bg-muted/20">
            <AudioPlayer url={audioUrl} variant="full" />
          </div>

          {/* Speech metrics */}
          {/* {speechMetrics && (
            <div className="flex gap-2 px-3 py-2 border-b border-border bg-muted/20 flex-wrap">
              <span className="text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{speechMetrics.wordCount}</span> words
              </span>
              <span className="text-muted-foreground/40 text-[11px]">·</span>
              <span className="text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{Math.round(speechMetrics.speechRate)}</span> wpm
              </span>
              <span className="text-muted-foreground/40 text-[11px]">·</span>
              <span className="text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{speechMetrics.pauseCount}</span> pauses
              </span>
              <span className="text-muted-foreground/40 text-[11px]">·</span>
              <span className="text-[11px] text-muted-foreground">
                Pron <span className="font-medium text-foreground">{speechMetrics.avgPronunciationScore}</span>
              </span>
            </div>
          )} */}

          {/* Criteria tabs */}
          {evaluation && speechMetrics && (
            <CriteriaTabs
              evaluation={evaluation}
              speechMetrics={speechMetrics}
              audioUrl={audioUrl}
            />
          )}
        </div>
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PracticeHistoryType } from '@/types'
import CriteriaItem from './criteria-item'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface HistoryItemProps {
  history: PracticeHistoryType
}

export default function HistoryItem({ history }: HistoryItemProps) {
  const [open, setOpen] = useState(false)
  const [transcriptOpen, setTranscriptOpen] = useState(false)

  const { audioUrl, transcript, band, criteria, createdAt } = history
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: vi })

  return (
    <div className={cn(
      'border rounded-lg overflow-hidden',
      open ? 'border-border' : 'border-border/60'
    )}>
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-background hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-2 h-2 rounded-full flex-shrink-0',
            band >= 7 ? 'bg-emerald-500' : band >= 6 ? 'bg-amber-500' : 'bg-muted-foreground'
          )} />
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          <span className={cn(
            'text-xs px-1.5 py-0.5 rounded font-medium',
            band >= 7
              ? 'bg-emerald-50 text-emerald-700'
              : band >= 6
              ? 'bg-amber-50 text-amber-700'
              : 'bg-muted text-muted-foreground'
          )}>
            Band {band}
          </span>
        </div>
        {open
          ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        }
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-border bg-muted/30">
          {/* Audio */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <button className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Play className="w-3 h-3 text-blue-600 ml-0.5" />
            </button>
            <div className="flex-1 h-1 bg-border rounded-full">
              <div className="w-[55%] h-full bg-blue-500 rounded-full" />
            </div>
            <span className="text-[10px] text-muted-foreground">0:42</span>
          </div>

          {/* Transcript */}
          <div className="px-3 py-2 border-b border-border">
            <button
              onClick={() => setTranscriptOpen((v) => !v)}
              className="flex items-center justify-between w-full mb-1"
            >
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Transcript
              </span>
              {transcriptOpen
                ? <ChevronDown className="w-3 h-3 text-muted-foreground" />
                : <ChevronRight className="w-3 h-3 text-muted-foreground" />
              }
            </button>
            {transcriptOpen && (
              <p className="text-xs text-muted-foreground leading-relaxed">{transcript}</p>
            )}
          </div>

          {/* Criteria */}
          <div>
            {criteria.map((c) => (
              <CriteriaItem key={c.name} criteria={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
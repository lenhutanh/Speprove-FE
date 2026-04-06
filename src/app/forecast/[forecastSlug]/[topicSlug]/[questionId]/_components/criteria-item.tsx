'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Criteria {
  name: string
  score: number
  feedback: string
}

export default function CriteriaItem({ criteria }: { criteria: Criteria }) {
  const [open, setOpen] = useState(false)
  const { name, score, feedback } = criteria

  const scoreColor = score >= 7
    ? 'text-emerald-700'
    : score >= 6
      ? 'text-amber-700'
      : 'text-red-700'

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/40 transition-colors"
      >
        <span className="text-xs text-foreground">{name}</span>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-medium', scoreColor)}>{score}</span>
          {open
            ? <ChevronDown className="w-3 h-3 text-muted-foreground" />
            : <ChevronRight className="w-3 h-3 text-muted-foreground" />
          }
        </div>
      </button>
      {open && (
        <div className="px-3 pb-2.5 text-xs text-muted-foreground leading-relaxed bg-background">
          {feedback}
        </div>
      )}
    </div>
  )
}
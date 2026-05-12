'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Criteria {
  name: string
  score: number
  feedback: string
}

export default function CriteriaItem({ criteria }: { criteria: Criteria }) {
  const [open, setOpen] = useState(false)
  const { name, score, feedback } = criteria

  const scoreColor =
    score >= 7
      ? 'text-emerald-700'
      : score >= 6
        ? 'text-amber-700'
        : 'text-red-700'

  return (
    <div className='border-border border-b last:border-0'>
      <button
        onClick={() => setOpen((v) => !v)}
        className='hover:bg-muted/40 flex w-full items-center justify-between px-3 py-2 transition-colors'
      >
        <span className='text-foreground text-xs'>{name}</span>
        <div className='flex items-center gap-2'>
          <span className={cn('text-xs font-medium', scoreColor)}>{score}</span>
          {open ? (
            <ChevronDown className='text-muted-foreground h-3 w-3' />
          ) : (
            <ChevronRight className='text-muted-foreground h-3 w-3' />
          )}
        </div>
      </button>
      {open && (
        <div className='text-muted-foreground bg-background px-3 pb-2.5 text-xs leading-relaxed'>
          {feedback}
        </div>
      )}
    </div>
  )
}

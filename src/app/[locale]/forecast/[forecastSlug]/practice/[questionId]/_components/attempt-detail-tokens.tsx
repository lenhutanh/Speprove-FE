'use client'

import { cn } from '@/lib/utils'
import { AttemptWordAssessment } from '@/types'
import * as RadixPopover from '@radix-ui/react-popover'
import { useState } from 'react'
import { FluencyPopover, RangeIssuePopover } from './attempt-detail-popovers'
import { PauseIssue, RangeIssue } from './attempt-detail-types'

const POPOVER_CLASS = cn(
  'border-border/60 bg-background z-50 w-[240px] rounded-lg border p-3 shadow-md',
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
)

export function WordToken({
  word,
  isHighlighted,
  highlightClass,
  popoverContent,
}: {
  word: AttemptWordAssessment
  isHighlighted: boolean
  highlightClass: string
  popoverContent?: React.ReactNode | ((isOpen: boolean) => React.ReactNode)
}) {
  const [open, setOpen] = useState(false)
  const inner = (
    <span
      className={cn(
        'rounded-[3px] px-0.5 py-px',
        isHighlighted && highlightClass,
        open && 'ring-foreground/40 ring-1 ring-offset-1',
      )}
    >
      {word.word}
      {word.punctuationAfter}
    </span>
  )

  if (!isHighlighted || !popoverContent) return <>{inner} </>

  return (
    <>
      <RadixPopover.Root open={open} onOpenChange={setOpen}>
        <RadixPopover.Trigger asChild>
          <span className='inline cursor-pointer'>{inner}</span>
        </RadixPopover.Trigger>
        {open && (
          <RadixPopover.Portal>
            <RadixPopover.Content
              side='bottom'
              align='start'
              sideOffset={6}
              avoidCollisions
              className={POPOVER_CLASS}
            >
              {typeof popoverContent === 'function'
                ? popoverContent(open)
                : popoverContent}
              <RadixPopover.Arrow className='fill-border/60' />
            </RadixPopover.Content>
          </RadixPopover.Portal>
        )}
      </RadixPopover.Root>{' '}
    </>
  )
}

export function RangeToken({
  words,
  issue,
  highlightClass,
}: {
  words: AttemptWordAssessment[]
  issue: RangeIssue
  highlightClass: string
}) {
  const [open, setOpen] = useState(false)
  const text = words
    .map((word) => `${word.word}${word.punctuationAfter ?? ''}`)
    .join(' ')

  return (
    <>
      <RadixPopover.Root open={open} onOpenChange={setOpen}>
        <RadixPopover.Trigger asChild>
          <span
            className={cn(
              'inline cursor-pointer rounded-xs px-0.5 py-px',
              highlightClass,
              open && 'ring-foreground/40 ring-1 ring-offset-1',
            )}
          >
            {text}
          </span>
        </RadixPopover.Trigger>
        {open && (
          <RadixPopover.Portal>
            <RadixPopover.Content
              side='bottom'
              align='start'
              sideOffset={6}
              avoidCollisions
              className={POPOVER_CLASS}
            >
              <RangeIssuePopover issue={issue} />
              <RadixPopover.Arrow className='fill-border/60' />
            </RadixPopover.Content>
          </RadixPopover.Portal>
        )}
      </RadixPopover.Root>{' '}
    </>
  )
}

function pauseMarkerClass(duration?: number) {
  if (duration != null && duration > 1) return 'bg-red-400'
  return 'bg-amber-400'
}

function pauseMarkerWidth(duration?: number) {
  if (duration == null) return 14
  return Math.min(34, Math.max(14, Math.round(duration * 18)))
}

export function PauseToken({ pause }: { pause: PauseIssue }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <RadixPopover.Root open={open} onOpenChange={setOpen}>
        <RadixPopover.Trigger asChild>
          <span
            className={cn(
              'mx-0.5 inline-block h-1.5 cursor-pointer rounded-full align-middle hover:brightness-95',
              pauseMarkerClass(pause.duration),
              open && 'ring-foreground/40 ring-1 ring-offset-1',
            )}
            style={{ width: pauseMarkerWidth(pause.duration) }}
          />
        </RadixPopover.Trigger>
        {open && (
          <RadixPopover.Portal>
            <RadixPopover.Content
              side='bottom'
              align='center'
              sideOffset={6}
              avoidCollisions
              className={POPOVER_CLASS}
            >
              <FluencyPopover pause={pause} />
              <RadixPopover.Arrow className='fill-border/60' />
            </RadixPopover.Content>
          </RadixPopover.Portal>
        )}
      </RadixPopover.Root>{' '}
    </>
  )
}

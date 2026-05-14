'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Mic, Square } from 'lucide-react'
import { AudioVisualizer } from './audio-visualizer'

export interface RecordButtonProps {
  phase: 'idle' | 'recording' | string
  analyser: AnalyserNode | null
  recordingSeconds: number
  onStart: () => void | Promise<unknown>
  onStop: () => void
  disabled?: boolean
  disabledTooltip?: string
  statusText?: string
}

export function RecordButton({
  phase,
  analyser,
  onStart,
  onStop,
  disabled = false,
  disabledTooltip,
  statusText,
}: RecordButtonProps) {
  const wrapTooltip = (element: React.ReactNode) =>
    disabled && disabledTooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className='inline-flex'>{element}</span>
        </TooltipTrigger>
        <TooltipContent>{disabledTooltip}</TooltipContent>
      </Tooltip>
    ) : (
      element
    )

  if (phase === 'idle') {
    return (
      <div className='flex flex-col items-center'>
        <div className='relative flex h-20 w-20 items-center justify-center'>
          {wrapTooltip(
            <Button
              variant='destructive'
              onClick={onStart}
              disabled={disabled}
              className='h-12 w-12 cursor-pointer rounded-full transition-all active:scale-120 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Mic className='text-white' />
            </Button>,
          )}
        </div>
        <span className='text-muted-foreground text-xs font-medium tracking-wider'>
          {statusText ?? 'Ghi âm'}
        </span>
      </div>
    )
  }

  const defaultText = 'Bấm dừng để nộp sớm'
  const displayText = statusText === '' ? null : (statusText ?? defaultText)

  return (
    <div className='flex flex-col items-center'>
      <div className='relative flex h-20 w-20 items-center justify-center'>
        <AudioVisualizer analyser={analyser} />
        {wrapTooltip(
          <Button
            variant='destructive'
            onClick={onStop}
            disabled={disabled}
            className='z-10 h-12 w-12 animate-pulse cursor-pointer rounded-full transition-all active:scale-120 disabled:animate-none disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Square className='h-3.5 w-3.5 fill-white text-white' />
          </Button>,
        )}
      </div>
      {displayText && (
        <span className='text-muted-foreground text-xs font-medium'>
          {displayText}
        </span>
      )}
    </div>
  )
}

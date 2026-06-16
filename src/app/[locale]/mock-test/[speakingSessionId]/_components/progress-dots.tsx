'use client'

import { cn } from '@/lib/utils'

interface ProgressDotsProps {
  total: number
  current: number
  isRecording?: boolean
}

export function ProgressDots({
  total,
  current,
  isRecording = false,
}: ProgressDotsProps) {
  return (
    <div className='flex flex-1 items-center gap-1.5'>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 max-w-7 flex-1 rounded-full transition-all duration-300',
            i < current
              ? 'bg-blue-500'
              : i === current
                ? isRecording
                  ? 'bg-red-500'
                  : 'bg-blue-500'
                : 'bg-muted',
          )}
        />
      ))}
    </div>
  )
}

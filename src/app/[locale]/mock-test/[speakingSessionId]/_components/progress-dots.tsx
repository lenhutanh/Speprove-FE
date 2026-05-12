'use client'

import { cn } from '@/lib/utils'

// ─── ProgressDots ─────────────────────────────────────────────────────────────
// Thanh dot tiến độ câu hỏi trên top bar

interface ProgressDotsProps {
  total: number
  /** Index của câu đang làm (0-based) */
  current: number
  /** Khi user đang nói → dot hiện tại màu đỏ, còn lại xanh/xám */
  isRecording?: boolean
}

export function ProgressDots({
  total,
  current,
  isRecording = false,
}: ProgressDotsProps) {
  const display = Math.min(total, 7)

  return (
    <div className='flex flex-1 items-center gap-1.5'>
      {Array.from({ length: display }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 w-7 rounded-full transition-all duration-300',
            i < current
              ? 'bg-blue-500'
              : i === current
                ? isRecording
                  ? 'bg-red-500'
                  : 'bg-blue-500'
                : 'bg-zinc-200',
          )}
        />
      ))}
    </div>
  )
}

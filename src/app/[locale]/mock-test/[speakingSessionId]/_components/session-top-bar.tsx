'use client'

import { Button } from '@/components/ui/button'
import { SpeakingSessionType } from '@/constants'
import { SessionState } from '@/types'
import { ProgressDots } from './progress-dots'

interface SessionTopBarProps {
  state: SessionState
  mode: SpeakingSessionType
  questionIndex: number
  totalQuestions: number
  isPartTwo: boolean
  prepSeconds?: number
  onExit: () => void
}

function partBadge(
  mode: SpeakingSessionType,
  qIndex: number,
  isPartTwo: boolean,
): string {
  if (isPartTwo) return 'Part 2'
  if (mode === 'mock_p1') return 'Part 1'
  if (mode === 'mock_p3') return 'Part 3'
  if (mode === 'full_test') {
    if (qIndex < 4) return 'Part 1'
    if (qIndex === 4) return 'Part 2'
    return 'Part 3'
  }
  return 'Part 1'
}

export function SessionTopBar({
  state,
  mode,
  questionIndex,
  totalQuestions,
  isPartTwo,
  onExit,
}: SessionTopBarProps) {
  return (
    <header className='flex h-12 shrink-0 items-center gap-3'>
      <div className='flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700'>
        {partBadge(mode, questionIndex, isPartTwo)}
      </div>

      {/* Progress dots */}
      <ProgressDots
        total={totalQuestions}
        current={questionIndex}
        isRecording={state === 'user_speaking'}
      />

      {/* Exit */}
      <Button size={'sm'} variant={'outline'} onClick={onExit}>
        Thoát
      </Button>
    </header>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { SpeakingSessionType } from '@/constants'
import { SessionState } from '@/types'
import { useTranslations } from 'next-intl'
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

function usePartBadge() {
  const t = useTranslations('mock_test.setup.modes')

  return (
    mode: SpeakingSessionType,
    qIndex: number,
    isPartTwo: boolean,
  ): string => {
    if (isPartTwo) return t('mock_p2.label')
    if (mode === 'mock_p1') return t('mock_p1.label')
    if (mode === 'mock_p3') return t('mock_p3.label')
    if (mode === 'full_test') {
      if (qIndex < 4) return t('mock_p1.label')
      if (qIndex === 4) return t('mock_p2.label')
      return t('mock_p3.label')
    }
    return t('mock_p1.label')
  }
}

export function SessionTopBar({
  state,
  mode,
  questionIndex,
  totalQuestions,
  isPartTwo,
  onExit,
}: SessionTopBarProps) {
  const tCommon = useTranslations('common')
  const getPartBadge = usePartBadge()

  return (
    <header className='flex h-12 shrink-0 items-center gap-3'>
      <div className='flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700'>
        {getPartBadge(mode, questionIndex, isPartTwo)}
      </div>

      {/* Progress dots */}
      <ProgressDots
        total={totalQuestions}
        current={questionIndex}
        isRecording={state === 'user_speaking'}
      />

      {/* Exit */}
      <Button size={'sm'} variant={'outline'} onClick={onExit}>
        {tCommon('exit')}
      </Button>
    </header>
  )
}

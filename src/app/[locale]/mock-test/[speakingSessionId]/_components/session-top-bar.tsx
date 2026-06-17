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
  part?: number
  onExit: () => void
}

function usePartBadge() {
  const t = useTranslations('mock_test.setup.modes')

  return (mode: SpeakingSessionType, part?: number): string => {
    if (part === 1) return t('mock_p1.label')
    if (part === 2) return t('mock_p2.label')
    if (part === 3) return t('mock_p3.label')
    if (mode === 'mock_p2') return t('mock_p2.label')
    if (mode === 'mock_p3') return t('mock_p3.label')
    return t('mock_p1.label')
  }
}

export function SessionTopBar({
  state,
  mode,
  questionIndex,
  totalQuestions,
  part,
  onExit,
}: SessionTopBarProps) {
  const tCommon = useTranslations('common')
  const getPartBadge = usePartBadge()

  return (
    <header className='flex h-12 shrink-0 items-center gap-3'>
      <div className='border-border bg-muted/50 text-foreground flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium'>
        {getPartBadge(mode, part)}
      </div>

      {/* Progress dots */}
      <ProgressDots
        total={totalQuestions}
        current={questionIndex}
        isRecording={state === 'user_speaking'}
      />

      {/* Exit */}
      <Button size={'sm'} variant={'destructive'} onClick={onExit}>
        {tCommon('exit')}
      </Button>
    </header>
  )
}

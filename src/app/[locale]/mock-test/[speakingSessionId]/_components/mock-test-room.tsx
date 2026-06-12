'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { InsufficientBalanceDialog } from '@/components/ui/insufficient-balance-dialog'
import { RecordButton } from '@/components/ui/recorder'
import { Spinner } from '@/components/ui/spinner'
import { SpeakingSessionType, formatCountdown } from '@/constants'
import { useNavigate, useRecorder, useRecordingCountdown } from '@/hooks'
import { useMockTestSession } from '@/hooks/use-mock-test-session'
import { usePathname } from '@/i18n/navigation'
import route from '@/routes'
import { Headphones } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CueCardPanel, NotePanel } from './cue-card'
import { SessionTopBar } from './session-top-bar'
import { WaveBars } from './wave-bars'

export default function MockTestRoom() {
  const t = useTranslations('mock_test.room')
  const { speakingSessionId } = useParams<{ speakingSessionId: string }>()

  const {
    state,
    questionData,
    prepSeconds,
    submitAttempt,
    replayQuestion,
    hasReplayed,
    isReplayingQuestion,
    isLoading,
  } = useMockTestSession(speakingSessionId)

  const [notes, setNotes] = useState<Record<string, string>>({})
  const [showBalanceDialog, setShowBalanceDialog] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const pathname = usePathname()
  const navigate = useNavigate()
  const autoRecordTriggered = useRef(false)
  const startRecordingLock = useRef(false)

  const {
    analyser,
    recordingSeconds,
    isRecording,
    startRecording,
    stopRecording,
  } = useRecorder()

  const partNum = questionData?.question?.part ?? 1

  const doStop = useCallback(async () => {
    try {
      const blob = await stopRecording()
      const res = await submitAttempt(blob)
      if (res?.success === false && res.errorCode === 'BUS_003') {
        setShowBalanceDialog(true)
      }
    } catch (e) {
      console.error(e)
    }
  }, [stopRecording, submitAttempt])

  const { countdown, canStop, startCountdown, stopCountdown } =
    useRecordingCountdown({
      part: partNum,
      isRecording,
      onAutoStop: doStop,
    })

  const handleStartRecording = useCallback(async () => {
    if (
      state !== 'user_speaking' ||
      isRecording ||
      startRecordingLock.current
    ) {
      return false
    }

    startRecordingLock.current = true
    try {
      const started = await startRecording()
      if (!started) return false

      startCountdown()
      return true
    } finally {
      startRecordingLock.current = false
    }
  }, [state, isRecording, startRecording, startCountdown])

  useEffect(() => {
    if (state !== 'user_speaking') {
      autoRecordTriggered.current = false
      return
    }

    if (autoRecordTriggered.current) return
    autoRecordTriggered.current = true

    handleStartRecording()
  }, [state, handleStartRecording])

  useEffect(() => {
    if (state !== 'user_speaking' || isRecording) return

    const retryStartRecording = () => {
      if (document.visibilityState !== 'visible') return
      handleStartRecording()
    }

    window.addEventListener('focus', retryStartRecording)
    document.addEventListener('visibilitychange', retryStartRecording)

    return () => {
      window.removeEventListener('focus', retryStartRecording)
      document.removeEventListener('visibilitychange', retryStartRecording)
    }
  }, [state, isRecording, handleStartRecording])

  const handleStopRecording = async () => {
    if (!canStop) return
    stopCountdown()
    await doStop()
  }

  const handleExit = () => {
    if (state === 'done') {
      navigate(route.mockTest)
      return
    }

    setShowExitDialog(true)
  }

  if (isLoading || !questionData) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Spinner className='h-8 w-8 text-blue-500' />
          <p className='text-muted-foreground text-sm'>{t('loading_room')}</p>
        </div>
      </div>
    )
  }

  const questionIndex = questionData.questionIndex ?? 0
  const totalQuestions = questionData.totalQuestions ?? 4
  const mode = (questionData.mode as SpeakingSessionType) ?? 'mock_p1'
  const questionId = questionData.question?.id ?? ''
  const note = notes[questionId] ?? ''
  const setCurrentNote = (value: string) => {
    if (!questionId) return
    setNotes((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const isPartTwo = questionData.question?.part === 2
  const isPrep = state === 'prep'
  const isTransitionOrSpeaking =
    state === 'transition' || state === 'user_speaking'

  const renderExaminerSpeaking = () => (
    <div className='flex flex-col items-center justify-center gap-4'>
      <WaveBars color='blue' />
      <p className='text-base font-medium'>{t('examiner_speaking')}</p>
      <p className='text-muted-foreground text-sm'>{t('listen_carefully')}</p>
    </div>
  )

  const renderPrep = () => (
    <div className='flex w-full flex-1 flex-col gap-6 overflow-hidden'>
      <div className='flex flex-1 gap-6 overflow-hidden'>
        <div className='flex flex-1 flex-col overflow-hidden'>
          <CueCardPanel
            data={{
              prompt: questionData.question?.content || '',
              bullets: questionData.question?.bulletPoints || [],
            }}
          />
        </div>
        <div className='flex flex-1 flex-col overflow-hidden'>
          <NotePanel
            key={`prep-${questionId}`}
            mode='prep'
            value={note}
            onChange={setCurrentNote}
            prepSeconds={prepSeconds}
          />
        </div>
      </div>

      <div className='flex justify-center pb-2'>{renderRecordArea()}</div>
    </div>
  )

  const renderRecordArea = () => {
    const isTransition = state === 'transition'
    const isUserSpeaking = state === 'user_speaking'

    const btnDisabled = isTransition || isPrep || (isUserSpeaking && !canStop)

    let statusText: string | undefined
    if (isPrep) {
      statusText = t('prep_time', { seconds: String(prepSeconds) })
    } else if (isTransition) {
      statusText = t('start_recording_in', {
        seconds: String(prepSeconds),
      })
    }

    const disabledTooltip =
      isUserSpeaking && !canStop ? t('min_speaking_time') : undefined

    const replayDisabled = !isTransition || hasReplayed || isReplayingQuestion

    const showTimer = isTransitionOrSpeaking || isPrep

    const timerDisplay =
      isTransition || isPrep
        ? formatCountdown(prepSeconds)
        : formatCountdown(countdown)

    return (
      <div className='flex flex-col items-center gap-3'>
        {showTimer && (
          <p className='text-3xl font-bold tracking-tight text-zinc-800 tabular-nums'>
            {timerDisplay}
          </p>
        )}

        <RecordButton
          phase={isRecording ? 'recording' : 'idle'}
          analyser={analyser}
          recordingSeconds={recordingSeconds}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          disabled={btnDisabled}
          disabledTooltip={disabledTooltip}
          statusText={statusText}
        />

        {!isPartTwo && isTransition && (
          <Button
            variant='outline'
            size='sm'
            onClick={replayQuestion}
            disabled={replayDisabled}
            className='mt-2 gap-2'
          >
            <Headphones className='h-3.5 w-3.5' />
            {t('replay_question')}
          </Button>
        )}
      </div>
    )
  }

  const renderPartTwoSpeaking = () => (
    <div className='flex w-full flex-1 flex-col gap-6 overflow-hidden'>
      <div className='flex flex-1 gap-6 overflow-hidden'>
        <div className='flex flex-1 flex-col overflow-hidden'>
          <CueCardPanel
            data={{
              prompt: questionData.question?.content || '',
              bullets: questionData.question?.bulletPoints || [],
            }}
          />
        </div>
        <div className='flex flex-1 flex-col overflow-hidden'>
          <NotePanel mode='speaking' value={note} prepSeconds={prepSeconds} />
        </div>
      </div>

      <div className='flex justify-center pb-2'>{renderRecordArea()}</div>
    </div>
  )

  const renderPartOneThreeSpeaking = () => (
    <div className='flex flex-col items-center justify-center gap-4'>
      {renderRecordArea()}
    </div>
  )

  const renderSubmitting = () => (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Spinner className='h-8 w-8 text-blue-500' />
      <p className='text-base font-medium'>{t('submitting')}</p>
    </div>
  )

  const renderDone = () => (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='text-lg font-semibold'>{t('done_title')}</p>
      <p className='text-muted-foreground text-sm'>{t('done_desc')}</p>
    </div>
  )

  const renderContent = () => {
    switch (state) {
      case 'fetching':
        return (
          <div className='flex flex-col items-center justify-center gap-4'>
            <Spinner className='text-muted-foreground h-6 w-6' />
            <p className='text-muted-foreground text-sm'>
              {t('loading_question')}
            </p>
          </div>
        )

      case 'examiner_speaking':
        return renderExaminerSpeaking()

      case 'prep':
        return renderPrep()

      case 'transition':
      case 'user_speaking':
        return isPartTwo
          ? renderPartTwoSpeaking()
          : renderPartOneThreeSpeaking()

      case 'submitting':
        return renderSubmitting()

      case 'done':
        return renderDone()

      default:
        return null
    }
  }

  return (
    <>
      <InsufficientBalanceDialog
        open={showBalanceDialog}
        returnUrl={pathname}
        onClose={() => setShowBalanceDialog(false)}
      />

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Roi phong thi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bai thi dang dien ra. Neu thoat bay gio, tien trinh hien tai co
              the khong duoc luu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>O lai</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(route.mockTest)}>
              Thoat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='mx-auto flex max-w-6xl flex-col px-6 py-4'>
        <SessionTopBar
          state={state}
          mode={mode}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          isPartTwo={isPartTwo}
          prepSeconds={prepSeconds}
          onExit={handleExit}
        />

        <main className='mx-auto flex w-full flex-1 items-center justify-center overflow-hidden py-6'>
          {renderContent()}
        </main>
      </div>
    </>
  )
}

'use client'

import { Container } from '@/components/layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InsufficientBalanceDialog } from '@/components/ui/insufficient-balance-dialog'
import { RecordButton } from '@/components/ui/recorder'
import { Spinner } from '@/components/ui/spinner'
import { SpeakingSessionType, formatCountdown } from '@/constants'
import { useNavigate, useRecorder, useRecordingCountdown } from '@/hooks'
import { useMockTestSession } from '@/hooks/use-mock-test-session'
import { Link, usePathname } from '@/i18n/navigation'
import route from '@/routes'
import { AlertTriangle, Check, Eye, Headphones, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MicChecker } from '../../_components/mic-checker'
import { CueCardPanel, NotePanel } from './cue-card'
import { SessionTopBar } from './session-top-bar'
import { WaveBars } from './wave-bars'

export default function MockTestRoom() {
  const t = useTranslations('mock_test.room')
  const tCommon = useTranslations('common')
  const { speakingSessionId } = useParams<{ speakingSessionId: string }>()

  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        sessionStorage.getItem(`mock_${speakingSessionId}_entered`) === 'true'
      )
    }
    return false
  })

  const {
    state,
    questionData,
    prepSeconds,
    submitAttempt,
    replayQuestion,
    hasReplayed,
    isReplayingQuestion,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMockTestSession(speakingSessionId, hasEntered)

  const [failedAudioBlob, setFailedAudioBlob] = useState<Blob | null>(null)

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(`mock_${speakingSessionId}_entered`)
    }
  }, [speakingSessionId])

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
      if (!blob) return
      const res = await submitAttempt(blob)
      if (res?.success === false) {
        if (res.errorCode === 'BUS_003') {
          setShowBalanceDialog(true)
        } else {
          setFailedAudioBlob(blob)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [stopRecording, submitAttempt])

  const handleResubmit = async () => {
    if (!failedAudioBlob) return
    const blob = failedAudioBlob
    setFailedAudioBlob(null)
    const res = await submitAttempt(blob)
    if (res?.success === false) {
      if (res.errorCode === 'BUS_003') {
        setShowBalanceDialog(true)
      } else {
        setFailedAudioBlob(blob)
      }
    }
  }

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
    if (!hasEntered || (state === 'fetching' && isError)) {
      navigate(route.mockTest)
      return
    }

    if (state === 'done') {
      navigate(route.mockTest)
      return
    }

    setShowExitDialog(true)
  }

  if (!hasEntered) {
    return (
      <Card className='animate-in fade-in mx-auto my-8 w-full max-w-lg duration-300'>
        <CardHeader className='pb-2 text-center'>
          <CardTitle className='text-foreground text-2xl font-bold tracking-tight'>
            {t('lobby_title')}
          </CardTitle>
          <CardDescription className='text-muted-foreground text-sm leading-relaxed'>
            {t('lobby_desc')}
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='bg-muted/30 border-border/50 rounded-xl border p-4'>
            <MicChecker />
          </div>

          <Alert className='border-amber-500/10 bg-amber-500/5 text-amber-600 dark:text-amber-400'>
            <AlertTriangle className='h-4 w-4 text-amber-500' />
            <AlertDescription className='text-xs leading-relaxed'>
              {t('lobby_warning')}
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className='flex justify-end gap-3 pt-2'>
          <Button variant='outline' onClick={handleExit}>
            {tCommon('exit')}
          </Button>
          <Button
            onClick={() => {
              sessionStorage.setItem(
                `mock_${speakingSessionId}_entered`,
                'true',
              )
              setHasEntered(true)
            }}
          >
            {t('enter_room')}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if ((isLoading || isFetching) && !questionData) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Spinner className='h-8 w-8 text-blue-500' />
          <p className='text-muted-foreground text-sm'>{t('loading_room')}</p>
        </div>
      </div>
    )
  }

  if (state === 'fetching' && isError) {
    return (
      <Card className='animate-in fade-in mx-auto my-8 w-full max-w-md duration-300'>
        <CardContent className='flex flex-col items-center justify-center gap-6 pt-6 text-center'>
          <div className='flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400'>
            <AlertTriangle className='size-7' />
          </div>
          <div className='space-y-2'>
            <h2 className='text-foreground text-xl font-semibold'>
              {t('fetch_error_title')}
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              {t('fetch_error_desc')}
            </p>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center gap-3 pt-2 pb-6'>
          <Button variant='outline' onClick={handleExit}>
            {tCommon('exit')}
          </Button>
          <Button onClick={() => refetch()}>
            {tCommon('please_try_again')}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!questionData) {
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
          <p className='text-foreground text-3xl font-bold tracking-tight tabular-nums'>
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
    <Card className='animate-in fade-in mx-auto my-8 w-full max-w-lg duration-300'>
      <CardContent className='flex flex-col items-center justify-center gap-6 pt-6 text-center'>
        <div className='animate-in fade-in zoom-in flex size-16 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-600 duration-300 dark:bg-emerald-900/30 dark:text-emerald-400'>
          <Check className='size-8 stroke-[3]' />
        </div>

        <div className='space-y-2'>
          <h2 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'>
            {t('done_title')}
          </h2>
          <p className='text-muted-foreground max-w-md text-sm leading-relaxed whitespace-pre-line sm:text-base'>
            {t('done_desc')}
          </p>
        </div>
      </CardContent>

      <CardFooter className='flex w-full flex-col justify-center gap-3 px-6 pt-2 pb-6 sm:flex-row'>
        <Button
          asChild
          variant='outline'
          className='h-10 w-full gap-2 rounded-xl px-5 sm:w-auto'
        >
          <Link href={`/mock-test/${speakingSessionId}/result`}>
            <Eye className='size-4' />
            {t('view_result')}
          </Link>
        </Button>
        <Button asChild className='h-10 w-full gap-2 rounded-xl px-5 sm:w-auto'>
          <Link href={route.mockTest}>
            <Plus className='size-4' />
            {t('start_new_test')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
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

      <AlertDialog
        open={failedAudioBlob !== null}
        onOpenChange={(open) => {
          if (!open) setFailedAudioBlob(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('submit_failed_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('submit_failed_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setFailedAudioBlob(null)
              }}
            >
              {t('re_record')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResubmit}>
              {t('retry_submit')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Container>
        {state !== 'done' && (
          <SessionTopBar
            state={state}
            mode={mode}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            part={questionData?.question?.part}
            onExit={handleExit}
          />
        )}

        <main className='mx-auto flex w-full flex-1 items-center justify-center overflow-hidden py-6'>
          {renderContent()}
        </main>
      </Container>
    </>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { InsufficientBalanceDialog } from '@/components/ui/insufficient-balance-dialog'
import { RecordButton } from '@/components/ui/recorder'
import {
  REPLAY_WINDOW_SECONDS,
  SpeakingSessionType,
  formatCountdown,
} from '@/constants'
import { useNavigate, useRecorder, useRecordingCountdown } from '@/hooks'
import { useMockTestSession } from '@/hooks/use-mock-test-session'
import route from '@/routes'
import { Headphones, Loader2 } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CueCardPanel, NotePanel } from './cue-card'
import { SessionTopBar } from './session-top-bar'
import { WaveBars } from './wave-bars'

export default function MockTestRoom() {
  const { speakingSessionId } = useParams<{ speakingSessionId: string }>()

  const {
    state,
    questionData,
    prepSeconds,
    submitAttempt,
    replayQuestion,
    hasReplayed,
    isLoading,
  } = useMockTestSession(speakingSessionId)

  const [note, setNote] = useState('')
  const [showBalanceDialog, setShowBalanceDialog] = useState(false)
  const [canReplay, setCanReplay] = useState(false)
  const pathname = usePathname()
  const navigate = useNavigate()
  const autoRecordTriggered = useRef(false)

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

  const { countdown, maxTime, canStop, startCountdown, stopCountdown } =
    useRecordingCountdown({
      part: partNum,
      isRecording,
      onAutoStop: doStop,
    })

  useEffect(() => {
    if (state !== 'user_speaking') {
      autoRecordTriggered.current = false
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanReplay(false)
      return
    }

    if (autoRecordTriggered.current) return
    autoRecordTriggered.current = true

    startRecording()
    startCountdown()
    setCanReplay(true)

    const replayTimer = setTimeout(
      () => setCanReplay(false),
      REPLAY_WINDOW_SECONDS * 1000,
    )

    return () => clearTimeout(replayTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const handleStopRecording = async () => {
    if (!canStop) return
    stopCountdown()
    await doStop()
  }

  if (isLoading || !questionData) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
          <p className='text-sm text-zinc-400'>Đang tải phòng thi...</p>
        </div>
      </div>
    )
  }

  const questionIndex = questionData.questionIndex ?? 0
  const totalQuestions = questionData.totalQuestions ?? 4
  const mode = (questionData.mode as SpeakingSessionType) ?? 'mock_p1'

  const isPartTwo = questionData.question?.part === 2
  const isPrep = state === 'prep'
  const isTransitionOrSpeaking =
    state === 'transition' || state === 'user_speaking'

  const renderExaminerSpeaking = () => (
    <div className='flex flex-col items-center justify-center gap-4'>
      <WaveBars color='blue' />
      <p className='text-base font-medium'>Giám khảo đang nói...</p>
      <p className='text-muted-foreground text-sm'>Hãy lắng nghe cẩn thận</p>
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
            mode='prep'
            value={note}
            onChange={setNote}
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
      statusText = `Chuẩn bị ${prepSeconds}s...`
    } else if (isTransition) {
      statusText = `Bắt đầu ghi âm sau ${prepSeconds}s...`
    }

    const disabledTooltip =
      isUserSpeaking && !canStop ? 'Nói ít nhất 10 giây' : undefined

    const replayDisabled = isTransition || isPrep || !canReplay || hasReplayed

    const showTimer = isTransitionOrSpeaking || isPrep

    const timerDisplay =
      isTransition || isPrep
        ? formatCountdown(maxTime)
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
          onStart={startRecording}
          onStop={handleStopRecording}
          disabled={btnDisabled}
          disabledTooltip={disabledTooltip}
          statusText={statusText}
        />

        {!isPartTwo && isTransitionOrSpeaking && (
          <Button
            variant='outline'
            size='sm'
            onClick={replayQuestion}
            disabled={replayDisabled}
            className='mt-2 gap-2'
          >
            <Headphones className='h-3.5 w-3.5' />
            Nghe lại câu hỏi
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
      <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
      <p className='text-base font-medium'>Đang nộp câu trả lời...</p>
    </div>
  )

  const renderDone = () => (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='text-lg font-semibold'>Bài thi hoàn tất</p>
      <p className='text-muted-foreground text-sm'>
        Chúc mừng bạn đã hoàn thành!
      </p>
    </div>
  )

  const renderContent = () => {
    switch (state) {
      case 'fetching':
        return (
          <div className='flex flex-col items-center justify-center gap-4'>
            <Loader2 className='h-6 w-6 animate-spin text-zinc-400' />
            <p className='text-sm text-zinc-400'>Đang tải câu hỏi...</p>
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
        callbackUrl={pathname}
        onClose={() => setShowBalanceDialog(false)}
      />

      <div className='mx-auto flex max-w-6xl flex-col px-6 py-4'>
        <SessionTopBar
          state={state}
          mode={mode}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          isPartTwo={isPartTwo}
          prepSeconds={prepSeconds}
          onExit={() => navigate(route.mockTest)}
        />

        <main className='mx-auto flex w-full flex-1 items-center justify-center overflow-hidden py-6'>
          {renderContent()}
        </main>
      </div>
    </>
  )
}

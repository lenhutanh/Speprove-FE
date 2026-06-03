'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Button } from '@/components/ui/button'
import { InsufficientBalanceDialog } from '@/components/ui/insufficient-balance-dialog'
import { RecordButton } from '@/components/ui/recorder'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AUDIO_PURPOSE,
  SPEAKING_SESSION_MODE,
  formatCountdown,
} from '@/constants'
import { useRecorder, useRecordingCountdown } from '@/hooks'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useAttemptQuery, useCreateAttemptMutation } from '@/queries'
import { useUploadAudioMutation } from '@/queries/file.query'
import route from '@/routes'
import { useAuthStore } from '@/store'
import { UploadAudioBodyType } from '@/types'
import { uploadAudioSchema } from '@/validations/file.schema'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Phase = 'idle' | 'recording' | 'recorded' | 'processing'

interface PracticeBottomBarProps {
  forecastSlug: string
  topicSlug?: string
  questionId: string
  part?: number
  prev?: { id: string; content: string }
  next?: { id: string; content: string }
  source?: string | null
  topicId?: string | null
  categoryName?: string | null
}

const STATUS_MAP: Record<
  number,
  {
    labelKey: 'preparing' | 'processing' | 'completed' | 'failed'
    isDone: boolean
    isFailed: boolean
  }
> = {
  0: { labelKey: 'preparing', isDone: false, isFailed: false },
  1: { labelKey: 'processing', isDone: false, isFailed: false },
  2: { labelKey: 'completed', isDone: true, isFailed: false },
  3: {
    labelKey: 'failed',
    isDone: false,
    isFailed: true,
  },
}

function ProcessingStatus({
  attemptId,
  onDone,
  onFailed,
}: {
  attemptId: string
  onDone: () => void
  onFailed: () => void
}) {
  const t = useTranslations('practice.bottom_bar')
  const [status, setStatus] = useState<number>(0)
  const { isDone, isFailed, labelKey } = STATUS_MAP[status] ?? STATUS_MAP[0]

  const { data } = useAttemptQuery(attemptId, {
    refetchInterval: isDone || isFailed ? false : 2500,
    enabled: !!attemptId,
  })

  useEffect(() => {
    if (!data?.data) return
    const s = data.data.status
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(s)
    if (s === 2) onDone()
    if (s === 3) onFailed()
  }, [data])

  return (
    <div className='flex min-w-55 flex-col items-center gap-2'>
      {!isDone && !isFailed && (
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1'>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className='h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400'
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.9s',
                }}
              />
            ))}
          </div>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500' />
        </div>
      )}

      {isDone && (
        <CheckCircle2 className='animate-in fade-in zoom-in h-5 w-5 text-emerald-500 duration-300' />
      )}

      {isFailed && <span className='text-destructive text-lg'>×</span>}

      <p
        className={cn(
          'text-center text-xs leading-relaxed transition-all duration-300',
          isDone
            ? 'font-medium text-emerald-600'
            : isFailed
              ? 'text-destructive'
              : 'text-muted-foreground',
        )}
      >
        {t(labelKey)}
      </p>
    </div>
  )
}

export default function PracticeBottomBar({
  forecastSlug,
  topicSlug,
  questionId,
  part = 1,
  prev,
  next,
}: PracticeBottomBarProps) {
  const t = useTranslations('practice.bottom_bar')
  const [phase, setPhase] = useState<Phase>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [showBalanceDialog, setShowBalanceDialog] = useState(false)

  const blobRef = useRef<Blob | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioFileIdRef = useRef<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const uploadAudioMutation = useUploadAudioMutation()
  const createAttemptMutation = useCreateAttemptMutation()

  const { isAuthenticated } = useAuthStore()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const {
    analyser,
    recordingSeconds,
    isRecording,
    startRecording,
    stopRecording,
    destroyRecorder,
  } = useRecorder()

  const doStopAndSave = async () => {
    try {
      const blob = await stopRecording()
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
      blobRef.current = blob
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        audio.currentTime = 0
      }
      setPhase('recorded')
    } catch (e) {
      console.error(e)
    }
  }

  const { countdown, canStop, startCountdown, stopCountdown } =
    useRecordingCountdown({
      part,
      isRecording,
      onAutoStop: doStopAndSave,
    })

  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : ''

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleStartRecording = async () => {
    if (!isAuthenticated) {
      toast.error(
        <p>
          {t('login_prefix')}&nbsp;
          <Link
            href={`${route.login}?returnUrl=${encodeURIComponent(pathname)}`}
            className='text-primary'
          >
            {t('login_link')}
          </Link>
          &nbsp;{t('login_suffix')}
        </p>,
      )
      return
    }

    const started = await startRecording()
    if (!started) return

    setPhase('recording')
    startCountdown()
  }

  const handleStopRecording = async () => {
    if (!canStop) return
    stopCountdown()
    await doStopAndSave()
  }

  const deleteRecording = () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      setBlobUrl(null)
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    blobRef.current = null
    audioFileIdRef.current = null
    setPhase('idle')
    destroyRecorder()
  }

  const handleSubmit = async () => {
    const blob = blobRef.current
    if (!blob) return

    if (blob.size < 1000) {
      toast.error(t('too_short'))
      return
    }

    setSubmitting(true)

    if (!audioFileIdRef.current) {
      const file = new File([blob], 'recording.webm', { type: 'audio/webm' })
      const payload: UploadAudioBodyType = {
        audio: file,
        purpose: AUDIO_PURPOSE.PRACTICE,
      }

      const validation = uploadAudioSchema.safeParse(payload)
      if (!validation.success) {
        toast.error(validation.error.issues[0].message)
        setSubmitting(false)
        return
      }

      try {
        const uploadRes = await uploadAudioMutation.mutateAsync(payload)
        audioFileIdRef.current = uploadRes.data.id
      } catch {
        toast.error(t('upload_failed'))
        setSubmitting(false)
        return
      }
    }

    try {
      const attemptRes = await createAttemptMutation.mutateAsync({
        mode: SPEAKING_SESSION_MODE.PRACTICE,
        forecastQuestionId: questionId,
        audioFileId: audioFileIdRef.current!,
      })

      if (attemptRes.errorCode === 'BUS_003') {
        setShowBalanceDialog(true)
        return
      }

      setAttemptId(attemptRes.data.id)
      setPhase('processing')

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      blobRef.current = null
    } catch {
      toast.error(t('submit_failed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleProcessingDone = () => {
    setTimeout(() => {
      deleteRecording()
      setAttemptId(null)
    }, 1800)
  }

  const handleProcessingFailed = () => {
    toast.error(t('scoring_failed'))
    setPhase('idle')
    setAttemptId(null)
  }

  return (
    <>
      <InsufficientBalanceDialog
        open={showBalanceDialog}
        returnUrl={pathname}
        onClose={() => setShowBalanceDialog(false)}
      />

      <div className='bg-background flex h-26 shrink-0 items-center justify-between px-6'>
        {prev ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' asChild>
                <Link
                  href={`/forecast/${forecastSlug}/practice/${prev.id}${queryString}`}
                >
                  <ChevronLeft className='h-3.5 w-3.5' />
                  {t('previous_question')}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{prev.content}</TooltipContent>
          </Tooltip>
        ) : (
          <div className='w-24' />
        )}

        <div className='flex flex-col items-center gap-1'>
          {phase === 'idle' && (
            <RecordButton
              phase={phase}
              analyser={analyser}
              recordingSeconds={recordingSeconds}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
            />
          )}

          {phase === 'recording' && (
            <div className='flex items-center gap-3'>
              <span className='text-sm font-medium text-zinc-500 tabular-nums'>
                {formatCountdown(countdown)}
              </span>
              <RecordButton
                phase={phase}
                analyser={analyser}
                recordingSeconds={recordingSeconds}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
                disabled={!canStop}
                disabledTooltip={t('min_speaking_time')}
                statusText=''
              />
            </div>
          )}

          {phase === 'recorded' && (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                onClick={deleteRecording}
                disabled={submitting}
                size='icon'
                className='shrink-0 rounded-full'
              >
                <Trash2 className='text-destructive h-3.5 w-3.5' />
              </Button>

              <AudioPlayer url={blobUrl!} variant='full' className='w-lg' />

              <Button
                variant='outline'
                onClick={handleSubmit}
                disabled={submitting}
                size='icon'
                className='shrink-0 rounded-full'
              >
                {submitting ? (
                  <span className='border-muted-foreground/40 border-t-muted-foreground h-3.5 w-3.5 animate-spin rounded-full border-2' />
                ) : (
                  <Send className='h-3.5 w-3.5' />
                )}
              </Button>
            </div>
          )}

          {phase === 'processing' && attemptId && (
            <ProcessingStatus
              attemptId={attemptId}
              onDone={handleProcessingDone}
              onFailed={handleProcessingFailed}
            />
          )}
        </div>

        {next ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' asChild>
                <Link
                  href={`/forecast/${forecastSlug}/practice/${next.id}${queryString}`}
                >
                  {t('next_question')}
                  <ChevronRight className='h-3.5 w-3.5' />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{next.content}</TooltipContent>
          </Tooltip>
        ) : (
          <div className='w-24' />
        )}
      </div>
    </>
  )
}

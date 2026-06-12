'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Button } from '@/components/ui/button'
import { InsufficientBalanceDialog } from '@/components/ui/insufficient-balance-dialog'
import { RecordButton } from '@/components/ui/recorder'
import { Spinner } from '@/components/ui/spinner'
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
import { useCreateAttemptMutation } from '@/queries'
import { useUploadAudioMutation } from '@/queries/file.query'
import route from '@/routes'
import { useAuthStore } from '@/store'
import { UploadAudioBodyType } from '@/types'
import { uploadAudioSchema } from '@/validations/file.schema'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Send, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Phase = 'idle' | 'recording' | 'recorded'

interface PracticeBottomBarProps {
  forecastSlug: string
  questionId: string
  part?: number
  prev?: { id: string; content: string }
  next?: { id: string; content: string }
  onAttemptCreated?: (attemptId: string) => void
}

export default function PracticeBottomBar({
  forecastSlug,
  questionId,
  part = 1,
  prev,
  next,
  onAttemptCreated,
}: PracticeBottomBarProps) {
  const t = useTranslations('practice.bottom_bar')
  const [phase, setPhase] = useState<Phase>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [showBalanceDialog, setShowBalanceDialog] = useState(false)

  const blobRef = useRef<Blob | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioFileIdRef = useRef<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const uploadAudioMutation = useUploadAudioMutation()
  const createAttemptMutation = useCreateAttemptMutation()
  const queryClient = useQueryClient()

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

      queryClient.invalidateQueries({ queryKey: ['attempt-list'] })
      onAttemptCreated?.(attemptRes.data.id)
      deleteRecording()
    } catch {
      toast.error(t('submit_failed'))
    } finally {
      setSubmitting(false)
    }
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
              <span className='text-muted-foreground text-sm font-medium tabular-nums'>
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
                  <Spinner className='size-3.5' />
                ) : (
                  <Send className='h-3.5 w-3.5' />
                )}
              </Button>
            </div>
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

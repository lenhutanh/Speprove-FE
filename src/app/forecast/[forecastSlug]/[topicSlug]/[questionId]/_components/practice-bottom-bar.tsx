'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Button } from '@/components/ui/button'
import { AUDIO_PURPOSE, SPEAKING_SESSION_MODE } from '@/constants'
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
  Mic,
  Send,
  Square,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import RecordRTC from 'recordrtc'
import { toast } from 'sonner'

type Phase = 'idle' | 'recording' | 'recorded' | 'processing'

interface PracticeBottomBarProps {
  forecastSlug: string
  topicSlug: string
  questionId: string
  prev?: { id: string; content: string }
  next?: { id: string; content: string }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const STATUS_MAP: Record<
  number,
  { label: string; isDone: boolean; isFailed: boolean }
> = {
  0: { label: 'Đang chuẩn bị...', isDone: false, isFailed: false },
  1: { label: 'Đang xử lý...', isDone: false, isFailed: false },
  2: { label: 'Hoàn thành!', isDone: true, isFailed: false },
  3: {
    label: 'Có lỗi xảy ra, vui lòng thử lại.',
    isDone: false,
    isFailed: true,
  },
}

function AudioVisualizer({ analyser }: { analyser: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !analyser) return
    const ctx = canvas.getContext('2d')!
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const baseRadius = 26
      const bars = 48

      for (let i = 0; i < bars; i++) {
        const dataIndex = Math.floor((i / bars) * bufferLength * 0.6)
        const value = dataArray[dataIndex] / 255
        const barHeight = 6 + value * 18

        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2
        const x1 = cx + Math.cos(angle) * baseRadius
        const y1 = cy + Math.sin(angle) * baseRadius
        const x2 = cx + Math.cos(angle) * (baseRadius + barHeight)
        const y2 = cy + Math.sin(angle) * (baseRadius + barHeight)

        const alpha = 0.4 + value * 0.6
        ctx.strokeStyle = `rgba(239,68,68,${alpha})`
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [analyser])

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className='pointer-events-none absolute inset-0'
    />
  )
}

// ----- Processing status display -----
function ProcessingStatus({
  attemptId,
  onDone,
  onFailed,
}: {
  attemptId: string
  onDone: () => void
  onFailed: () => void
}) {
  const [status, setStatus] = useState<number>(0)
  const { isDone, isFailed, label } = STATUS_MAP[status] ?? STATUS_MAP[0]

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
          {/* Animated dots */}
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
          {/* Spinner */}
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500' />
        </div>
      )}

      {isDone && (
        <CheckCircle2 className='animate-in fade-in zoom-in h-5 w-5 text-emerald-500 duration-300' />
      )}

      {isFailed && <span className='text-destructive text-lg'>✕</span>}

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
        {label}
      </p>
    </div>
  )
}
export default function PracticeBottomBar({
  forecastSlug,
  topicSlug,
  questionId,
  prev,
  next,
}: PracticeBottomBarProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)

  const recorderRef = useRef<RecordRTC | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const blobRef = useRef<Blob | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const uploadAudioMutation = useUploadAudioMutation()
  const createAttemptMutation = useCreateAttemptMutation()

  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    return () => {
      stopTimer()
      streamRef.current
        ?.getTracks()
        .forEach((t: { stop: () => any }) => t.stop())
      audioCtxRef.current?.close()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startRecording = async () => {
    if (!isAuthenticated) {
      toast.error(
        <p>
          Vui lòng&nbsp;
          <Link href={route.login} className='text-primary'>
            đăng nhập
          </Link>
          &nbsp;để luyện tập
        </p>,
      )
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyserNode = audioCtx.createAnalyser()
      analyserNode.fftSize = 256
      analyserNode.smoothingTimeConstant = 0.8
      source.connect(analyserNode)
      setAnalyser(analyserNode)

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        recorderType: RecordRTC.StereoAudioRecorder,
        mimeType: 'audio/wav',
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      })

      recorder.startRecording()
      recorderRef.current = recorder

      setRecordingSeconds(0)
      setPhase('recording')

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev: number) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error(err)
      toast.error('Không thể bắt đầu ghi âm. Vui lòng kiểm tra Micro.')
    }
  }

  const stopRecording = () => {
    stopTimer()
    setAnalyser(null)
    audioCtxRef.current?.close()

    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob()
        const url = URL.createObjectURL(blob)
        setBlobUrl(url)
        blobRef.current = blob

        const audio = new Audio(url)
        audioRef.current = audio

        audio.onended = () => {
          audio.currentTime = 0
        }

        streamRef.current
          ?.getTracks()
          .forEach((t: { stop: () => any }) => t.stop())
        streamRef.current = null
        setPhase('recorded')
      })
    }
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
    setRecordingSeconds(0)
    setPhase('idle')
    if (recorderRef.current) {
      recorderRef.current.destroy()
      recorderRef.current = null
    }
  }

  const handleSubmit = async () => {
    const blob = blobRef.current
    if (!blob) return

    if (blob.size < 1000) {
      toast.error('Bài nói quá ngắn, vui lòng thử lại.')
      return
    }

    const file = new File([blob], `recording.webm`, { type: 'audio/webm' })
    const payload: UploadAudioBodyType = {
      audio: file,
      purpose: AUDIO_PURPOSE.PRACTICE,
    }

    const validation = uploadAudioSchema.safeParse(payload)
    if (!validation.success) {
      toast.error(validation.error.issues[0].message)
      return
    }

    setSubmitting(true)

    try {
      const uploadRes = await uploadAudioMutation.mutateAsync(payload)
      const audioFileId = uploadRes.data.id
      const attemptRes = await createAttemptMutation.mutateAsync({
        mode: SPEAKING_SESSION_MODE.PRACTICE,
        forecastQuestionId: questionId,
        audioFileId,
      })

      setAttemptId(attemptRes.data.id)
      setPhase('processing')

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      blobRef.current = null
    } catch {
      toast.error('Lỗi khi gửi bài, vui lòng thử lại.')
      setSubmitting(false)
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
    toast.error('Chấm điểm thất bại. Vui lòng thử lại.')
    setPhase('idle')
    setAttemptId(null)
  }

  return (
    <div className='bg-background flex h-26 shrink-0 items-center justify-between px-6'>
      {/* Prev */}
      {prev ? (
        <Button variant='outline' asChild>
          <Link href={`/forecast/${forecastSlug}/${topicSlug}/${prev.id}`}>
            <ChevronLeft className='h-3.5 w-3.5' />
            Câu trước
          </Link>
        </Button>
      ) : (
        <div className='w-24' />
      )}

      {/* Center controls */}
      <div className='flex flex-col items-center gap-1.5'>
        {/* IDLE */}
        {phase === 'idle' && (
          <>
            <Button
              variant='destructive'
              onClick={startRecording}
              className='h-12 w-12 cursor-pointer rounded-full transition-all active:scale-120'
            >
              <Mic className='text-white' />
            </Button>
            <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
              Ghi âm
            </span>
          </>
        )}

        {/* RECORDING — mic button + canvas visualizer */}
        {phase === 'recording' && (
          <>
            <div className='relative flex h-[120px] w-[120px] items-center justify-center'>
              <AudioVisualizer analyser={analyser} />
              <Button
                variant='destructive'
                onClick={stopRecording}
                size='icon-lg'
                className='z-10 animate-pulse cursor-pointer rounded-full active:scale-120'
              >
                <Square className='h-3.5 w-3.5 fill-white text-white' />
              </Button>
            </div>
            <span className='text-muted-foreground -mt-2 text-[11px] font-medium tabular-nums'>
              {formatTime(recordingSeconds)}
            </span>
          </>
        )}

        {/* RECORDED — playback + submit */}
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

        {/* PROCESSING — polling status */}
        {phase === 'processing' && attemptId && (
          <ProcessingStatus
            attemptId={attemptId}
            onDone={handleProcessingDone}
            onFailed={handleProcessingFailed}
          />
        )}
      </div>

      {/* Next */}
      {next ? (
        <Button variant='outline' asChild>
          <Link href={`/forecast/${forecastSlug}/${topicSlug}/${next.id}`}>
            Câu sau
            <ChevronRight className='h-3.5 w-3.5' />
          </Link>
        </Button>
      ) : (
        <div className='w-24' />
      )}
    </div>
  )
}

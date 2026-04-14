'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Mic, Square, Play, Pause, Trash2, Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import RecordRTC from 'recordrtc'
import { useCreateAttemptMutation, useAttemptQuery } from '@/queries'
import { AUDIO_PURPOSE, SPEAKING_SESSION_MODE } from '@/constants'
import { uploadAudioSchema } from '@/validations/file.schema'
import { useUploadAudioMutation } from '@/queries/file.query'
import { UploadAudioBodyType } from '@/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Phase = 'idle' | 'recording' | 'recorded' | 'processing'

interface PracticeBottomBarProps {
  forecastSlug: string
  topicSlug: string
  questionId: string
  prev?: { id: string, content: string }
  next?: { id: string, content: string }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const STATUS_MAP: Record<number, { label: string; isDone: boolean; isFailed: boolean }> = {
  0: { label: 'Đang chuẩn bị...', isDone: false, isFailed: false },
  1: { label: 'Đang xử lý...', isDone: false, isFailed: false },
  2: { label: 'Hoàn thành!', isDone: true, isFailed: false },
  3: { label: 'Có lỗi xảy ra, vui lòng thử lại.', isDone: false, isFailed: true },
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
      className="absolute inset-0 pointer-events-none"
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
    <div className="flex flex-col items-center gap-2 min-w-[220px]">
      {!isDone && !isFailed && (
        <div className="flex items-center gap-2">
          {/* Animated dots */}
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
              />
            ))}
          </div>
          {/* Spinner */}
          <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      )}

      {isDone && (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in fade-in zoom-in duration-300" />
      )}

      {isFailed && (
        <span className="text-destructive text-lg">✕</span>
      )}

      <p
        className={cn(
          'text-xs text-center leading-relaxed transition-all duration-300',
          isDone ? 'text-emerald-600 font-medium' : isFailed ? 'text-destructive' : 'text-muted-foreground'
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)

  const recorderRef = useRef<RecordRTC | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const blobRef = useRef<Blob | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const seekBarRef = useRef<HTMLDivElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const uploadAudioMutation = useUploadAudioMutation()
  const createAttemptMutation = useCreateAttemptMutation()

  useEffect(() => {
    return () => {
      stopTimer()
      streamRef.current?.getTracks().forEach((t: { stop: () => any }) => t.stop())
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
        blobRef.current = blob

        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio

        audio.onloadedmetadata = () => setDuration(audio.duration)
        audio.ontimeupdate = () => setPlaybackTime(audio.currentTime)
        audio.onended = () => {
          setIsPlaying(false)
          setPlaybackTime(0)
          audio.currentTime = 0
        }

        streamRef.current?.getTracks().forEach((t: { stop: () => any }) => t.stop())
        streamRef.current = null
        setPhase('recorded')
      })
    }
  }

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration || !seekBarRef.current) return
    const rect = seekBarRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
    setPlaybackTime(audio.currentTime)
  }

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    blobRef.current = null
    setIsPlaying(false)
    setPlaybackTime(0)
    setDuration(0)
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
    const payload: UploadAudioBodyType = { audio: file, purpose: AUDIO_PURPOSE.PRACTICE }

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

  const progress = duration > 0 ? (playbackTime / duration) * 100 : 0

  return (
    <div className="flex items-center justify-between px-6 bg-background border-t border-border shrink-0 h-26">
      {/* Prev */}
      {prev ? (
        <Button variant="outline" asChild>
          <Link href={`/forecast/${forecastSlug}/${topicSlug}/${prev.id}`}>
            <ChevronLeft className="w-3.5 h-3.5" />
            Câu trước
          </Link>
        </Button>
      ) : (
        <div className="w-24" />
      )}

      {/* Center controls */}
      <div className="flex flex-col items-center gap-1.5">

        {/* IDLE */}
        {phase === 'idle' && (
          <>
            <Button
              variant="destructive"
              onClick={startRecording}
              size="icon-lg"
              className="rounded-full transition-all active:scale-120 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-white" />
            </Button>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Ghi âm
            </span>
          </>
        )}

        {/* RECORDING — mic button + canvas visualizer */}
        {phase === 'recording' && (
          <>
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
              <AudioVisualizer analyser={analyser} />
              <Button
                variant="destructive"
                onClick={stopRecording}
                size="icon-lg"
                className="rounded-full z-10 animate-pulse active:scale-120 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 text-white fill-white" />
              </Button>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground tabular-nums -mt-2">
              {formatTime(recordingSeconds)}
            </span>
          </>
        )}

        {/* RECORDED — playback + submit */}
        {phase === 'recorded' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={deleteRecording}
              disabled={submitting}
              size="icon"
              className="rounded-full shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </Button>

            <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-full px-2 py-1.5">
              <button
                onClick={togglePlayback}
                disabled={submitting}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 shrink-0"
              >
                {isPlaying
                  ? <Pause className="w-3 h-3 text-white fill-white" />
                  : <Play className="w-3 h-3 text-white fill-white" />
                }
              </button>
              <div
                ref={seekBarRef}
                onClick={handleSeek}
                className="w-60 h-1 bg-border rounded-full cursor-pointer relative overflow-hidden"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-[width] duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                {formatTime(playbackTime)}
                <span className="text-muted-foreground/50"> / </span>
                {formatTime(duration)}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={handleSubmit}
              disabled={submitting}
              size="icon"
              className="rounded-full shrink-0"
            >
              {submitting
                ? <span className="w-3.5 h-3.5 border-2 border-muted-foreground/40 border-t-muted-foreground rounded-full animate-spin" />
                : <Send className="w-3.5 h-3.5" />
              }
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
        <Button variant="outline" asChild>
          <Link href={`/forecast/${forecastSlug}/${topicSlug}/${next.id}`}>
            Câu sau
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      ) : (
        <div className="w-24" />
      )}
    </div>
  )
}

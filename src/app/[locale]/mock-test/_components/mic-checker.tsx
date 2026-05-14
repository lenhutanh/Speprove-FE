import { AudioPlayer } from '@/components/ui/audio-player'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface MicCheckerProps {
  onDeviceChange?: (deviceId: string) => void
  className?: string
}

export function MicChecker({ onDeviceChange, className }: MicCheckerProps) {
  const t = useTranslations('mock_test.components.mic_checker')
  const tCommon = useTranslations('common')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState<string>('')
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>()

  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const volBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((all) => {
      const mics = all.filter((d) => d.kind === 'audioinput')
      setDevices(mics)
      if (mics[0]) setDeviceId(mics[0].deviceId)
    })

    return () => stopStream()
  }, [])

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  function stopStream() {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    if (volBarRef.current) volBarRef.current.style.width = '0%'
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      })
      streamRef.current = stream

      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      const data = new Uint8Array(analyser.frequencyBinCount)
      ctx.createMediaStreamSource(stream).connect(analyser)

      const tick = () => {
        analyser.getByteFrequencyData(data)
        const vol = Math.round((Math.max(...data) / 255) * 100)
        if (volBarRef.current) volBarRef.current.style.width = `${vol}%`
        animRef.current = requestAnimationFrame(tick)
      }
      tick()

      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return URL.createObjectURL(blob)
        })
        stopStream()
      }
      recorder.start()
      recorderRef.current = recorder
      setRecording(true)
      setAudioUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return undefined
      })
    } catch {
      toast.error('Khong the truy cap microphone')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
    setRecording(false)
  }

  function handleDeviceChange(id: string) {
    setDeviceId(id)
    onDeviceChange?.(id)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Select value={deviceId} onValueChange={handleDeviceChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {devices.map((d, i) => (
              <SelectItem key={d.deviceId} value={d.deviceId}>
                {d.label || `${tCommon('microphone')} ${i + 1}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className='flex items-center gap-4'>
        <Button
          size='sm'
          variant={recording ? 'destructive' : 'outline'}
          onClick={recording ? stopRecording : startRecording}
          className='w-18'
        >
          {recording ? tCommon('stop') : t('record')}
        </Button>
        <div className='bg-muted h-1.5 flex-1 overflow-hidden rounded-full'>
          <div
            ref={volBarRef}
            className='h-full rounded-full bg-emerald-500'
            style={{ width: '0%', transition: 'width 0.05s linear' }}
          />
        </div>
      </div>

      {audioUrl && <AudioPlayer url={audioUrl} variant='full' />}
    </div>
  )
}

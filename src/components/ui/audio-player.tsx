'use client'

import { cn } from '@/lib/utils'
import { Loader2, Pause, Play, Volume2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type AudioIconVariant = 'play' | 'volume'

interface AudioPlayerProps {
  url?: string
  variant?: 'minimal' | 'full'
  autoPlay?: boolean
  delay?: number
  className?: string
  iconVariant?: AudioIconVariant
  startTime?: number
  endTime?: number
  onEnded?: () => void
  loading?: boolean
}

const iconMap: Record<
  AudioIconVariant,
  (isPlaying: boolean) => React.ReactNode
> = {
  play: (isPlaying) =>
    isPlaying ? (
      <Pause className='h-2.5 w-2.5 fill-current text-indigo-600' />
    ) : (
      <Play className='ml-0.5 h-2.5 w-2.5 fill-current text-indigo-600' />
    ),
  volume: (isPlaying) => (
    <span className='relative flex h-3 w-3 items-center justify-center'>
      <Volume2 className='h-3 w-3 text-indigo-600' />
      {isPlaying && (
        <span className='absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-20' />
      )}
    </span>
  ),
}

export const AudioPlayer = ({
  url,
  variant = 'minimal',
  autoPlay = false,
  delay = 2000,
  className,
  iconVariant,
  startTime,
  endTime,
  onEnded,
  loading,
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [duration, setDuration] = useState('0:00')

  const isPending = loading || isLoading

  // Adjust state when URL changes to avoid cascading renders in useEffect
  const [prevUrl, setPrevUrl] = useState(url)
  if (url !== prevUrl) {
    setPrevUrl(url)
    setIsPlaying(false)
    setDuration('0:00')
  }

  // Progress + currentTime driven by rAF — stored in refs to avoid re-render on every frame
  const progressRef = useRef(0) // 0–100, live value
  const fillRef = useRef<HTMLDivElement>(null) // progress bar fill
  const thumbRef = useRef<HTMLDivElement>(null) // draggable thumb
  const currentTimeRef = useRef<HTMLSpanElement>(null) // current time label

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const rafRef = useRef<number | null>(null)
  const seekBarRef = useRef<HTMLDivElement | null>(null)
  const isDraggingRef = useRef(false)

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const formatTime = (secs: number): string => {
    if (!isFinite(secs) || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  /** Write progress directly to DOM — zero React re-renders */
  const applyProgress = useCallback((pct: number) => {
    progressRef.current = pct
    if (fillRef.current) fillRef.current.style.width = `${pct}%`
    if (thumbRef.current) thumbRef.current.style.left = `calc(${pct}% - 6px)`
    if (seekBarRef.current)
      seekBarRef.current.setAttribute(
        'aria-valuenow',
        Math.round(pct).toString(),
      )
  }, [])

  const applyCurrentTime = useCallback((secs: number) => {
    if (currentTimeRef.current)
      currentTimeRef.current.textContent = formatTime(secs)
  }, [])

  const xToFraction = (clientX: number): number => {
    const bar = seekBarRef.current
    if (!bar) return 0
    const { left, width } = bar.getBoundingClientRect()
    return Math.max(0, Math.min(1, (clientX - left) / width))
  }

  const seekTo = useCallback(
    (fraction: number) => {
      const audio = audioRef.current
      if (!audio || !isFinite(audio.duration)) return
      audio.currentTime = fraction * audio.duration
      applyProgress(fraction * 100)
      applyCurrentTime(audio.currentTime)
    },
    [applyProgress, applyCurrentTime],
  )

  // ─── rAF loop — runs only while playing ──────────────────────────────────────

  const startRaf = useCallback(() => {
    const tick = () => {
      const audio = audioRef.current
      if (
        audio &&
        !isDraggingRef.current &&
        isFinite(audio.duration) &&
        audio.duration > 0
      ) {
        if (endTime !== undefined && audio.currentTime >= endTime) {
          audio.pause()
          audio.currentTime = startTime ?? 0
          if (onEnded) onEnded()
          return
        }
        applyProgress((audio.currentTime / audio.duration) * 100)
        applyCurrentTime(audio.currentTime)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [applyProgress, applyCurrentTime, startTime, endTime, onEnded])

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  // ─── Audio initialisation ─────────────────────────────────────────────────────

  const initAudio = useCallback((): HTMLAudioElement | null => {
    if (!url) return null
    const audio = new Audio(url)
    audioRef.current = audio

    audio.onplay = () => {
      setIsPlaying(true)
      startRaf()
    }
    audio.onpause = () => {
      setIsPlaying(false)
      stopRaf()
    }
    audio.onended = () => {
      setIsPlaying(false)
      stopRaf()
      applyProgress(0)
      applyCurrentTime(0)
      if (onEnded) onEnded()
    }
    audio.onloadstart = () => setIsLoading(true)
    audio.oncanplaythrough = () => setIsLoading(false)
    audio.onloadedmetadata = () => setDuration(formatTime(audio.duration))

    return audio
  }, [url, startRaf, stopRaf, applyProgress, applyCurrentTime, onEnded])

  // ─── Seek bar pointer events ──────────────────────────────────────────────────

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    isDraggingRef.current = true
    applyProgress(xToFraction(e.clientX) * 100)

    const onMove = (ev: MouseEvent) =>
      applyProgress(xToFraction(ev.clientX) * 100)
    const onUp = (ev: MouseEvent) => {
      isDraggingRef.current = false
      seekTo(xToFraction(ev.clientX))
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true
    applyProgress(xToFraction(e.touches[0].clientX) * 100)

    const onMove = (ev: TouchEvent) =>
      applyProgress(xToFraction(ev.touches[0].clientX) * 100)
    const onEnd = (ev: TouchEvent) => {
      isDraggingRef.current = false
      seekTo(xToFraction(ev.changedTouches[0].clientX))
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd)
  }

  // ─── Play / Pause ─────────────────────────────────────────────────────────────

  const togglePlay = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!audioRef.current) {
      const audio = initAudio()
      if (startTime !== undefined) audio!.currentTime = startTime // thêm
      audio?.play().catch(() => {})
      return
    }
    if (isPlaying) audioRef.current.pause()
    else {
      if (startTime !== undefined) audioRef.current.currentTime = startTime // thêm
      audioRef.current.play().catch(() => {})
    }
  }

  // ─── Effect: reset on URL change ─────────────────────────────────────────────

  useEffect(() => {
    stopRaf()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    applyProgress(0)
    applyCurrentTime(0)

    if (!url) return

    const audio = initAudio()

    if (autoPlay) {
      timerRef.current = setTimeout(() => {
        audio?.play().catch((err) => console.warn('Autoplay blocked:', err))
        timerRef.current = null
      }, delay)
    }

    return () => {
      stopRaf()
      if (timerRef.current) clearTimeout(timerRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoPlay, delay])

  // ─── Render ───────────────────────────────────────────────────────────────────

  const PlayBtn = (
    <button
      onClick={togglePlay}
      disabled={isPending || !url}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-indigo-50 transition-all hover:bg-indigo-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40',
      )}
    >
      {isPending ? (
        <Loader2 className='h-5 w-5 animate-spin text-indigo-600' />
      ) : (
        iconMap[(iconVariant ?? 'play') as AudioIconVariant](isPlaying)
      )}
    </button>
  )

  if (variant === 'minimal') {
    return <div className={cn('inline-block', className)}>{PlayBtn}</div>
  }

  return (
    <div className={cn('flex w-full items-center gap-4', className)}>
      {PlayBtn}

      {/* Seek bar */}
      <div
        ref={seekBarRef}
        role='slider'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-label='Audio seek bar'
        tabIndex={0}
        className='relative h-1.5 flex-1 cursor-pointer rounded-full bg-indigo-100'
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onKeyDown={(e) => {
          const audio = audioRef.current
          if (!audio || !isFinite(audio.duration)) return
          if (e.key === 'ArrowRight')
            seekTo((audio.currentTime + 5) / audio.duration)
          if (e.key === 'ArrowLeft')
            seekTo(Math.max(0, audio.currentTime - 5) / audio.duration)
        }}
      >
        {/* Fill */}
        <div
          ref={fillRef}
          className='pointer-events-none absolute inset-y-0 left-0 rounded-full bg-indigo-400'
          style={{ width: '0%' }}
        />
        {/* Thumb — always visible */}
        <div
          ref={thumbRef}
          className={cn(
            'pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full',
            'border-2 border-indigo-500 bg-white shadow-sm',
            'transition-transform duration-100 hover:scale-125',
          )}
          style={{ left: 'calc(0% - 6px)' }}
        />
      </div>

      <div className='text-muted-foreground flex items-center gap-1 text-xs font-medium tabular-nums'>
        {/* Current time — updated via ref, no re-render */}
        <span ref={currentTimeRef} className='w-fit text-right'>
          0:00
        </span>

        <span className='text-center'>/</span>

        {/* Total duration — fixed */}
        <span className='w-fit text-left'>{duration}</span>
      </div>
    </div>
  )
}

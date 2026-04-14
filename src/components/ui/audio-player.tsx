'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Loader2, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type AudioIconVariant = 'play' | 'volume'

interface AudioPlayerProps {
  url: string
  variant?: 'minimal' | 'full'
  autoPlay?: boolean
  delay?: number
  className?: string
  iconVariant?: AudioIconVariant
  startTime?: number
  endTime?: number
}


const iconMap: Record<AudioIconVariant, (isPlaying: boolean) => React.ReactNode> = {
  play: (isPlaying) => isPlaying
    ? <Pause className="w-2.5 h-2.5 text-indigo-600 fill-current" />
    : <Play className="w-2.5 h-2.5 text-indigo-600 ml-0.5 fill-current" />,
  volume: (isPlaying) => (
    <span className="relative flex items-center justify-center w-3 h-3">
      <Volume2 className="w-3 h-3 text-indigo-600" />
      {isPlaying && (
        <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-20 animate-ping" />
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
  endTime
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [duration, setDuration] = useState('0:00')

  // Progress + currentTime driven by rAF — stored in refs to avoid re-render on every frame
  const progressRef = useRef(0)                        // 0–100, live value
  const fillRef = useRef<HTMLDivElement>(null)          // progress bar fill
  const thumbRef = useRef<HTMLDivElement>(null)         // draggable thumb
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
  }, [])

  const applyCurrentTime = useCallback((secs: number) => {
    if (currentTimeRef.current) currentTimeRef.current.textContent = formatTime(secs)
  }, [])

  const xToFraction = (clientX: number): number => {
    const bar = seekBarRef.current
    if (!bar) return 0
    const { left, width } = bar.getBoundingClientRect()
    return Math.max(0, Math.min(1, (clientX - left) / width))
  }

  const seekTo = useCallback((fraction: number) => {
    const audio = audioRef.current
    if (!audio || !isFinite(audio.duration)) return
    audio.currentTime = fraction * audio.duration
    applyProgress(fraction * 100)
    applyCurrentTime(audio.currentTime)
  }, [applyProgress, applyCurrentTime])

  // ─── rAF loop — runs only while playing ──────────────────────────────────────

  const startRaf = useCallback(() => {
    const tick = () => {
      const audio = audioRef.current
      if (audio && !isDraggingRef.current && isFinite(audio.duration) && audio.duration > 0) {
        if (endTime !== undefined && audio.currentTime >= endTime) {
          audio.pause()
          audio.currentTime = startTime ?? 0
          return
        }
        applyProgress((audio.currentTime / audio.duration) * 100)
        applyCurrentTime(audio.currentTime)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [applyProgress, applyCurrentTime, startTime, endTime])

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

    audio.onplay = () => { setIsPlaying(true); startRaf() }
    audio.onpause = () => { setIsPlaying(false); stopRaf() }
    audio.onended = () => {
      setIsPlaying(false)
      stopRaf()
      applyProgress(0)
      applyCurrentTime(0)
    }
    audio.onloadstart = () => setIsLoading(true)
    audio.oncanplaythrough = () => setIsLoading(false)
    audio.onloadedmetadata = () => setDuration(formatTime(audio.duration))

    return audio
  }, [url, startRaf, stopRaf, applyProgress, applyCurrentTime])

  // ─── Seek bar pointer events ──────────────────────────────────────────────────

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    isDraggingRef.current = true
    applyProgress(xToFraction(e.clientX) * 100)

    const onMove = (ev: MouseEvent) => applyProgress(xToFraction(ev.clientX) * 100)
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

    const onMove = (ev: TouchEvent) => applyProgress(xToFraction(ev.touches[0].clientX) * 100)
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
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }

    if (!audioRef.current) {
      const audio = initAudio()
      if (startTime !== undefined) audio!.currentTime = startTime  // thêm
      audio?.play().catch(() => { })
      return
    }
    if (isPlaying) audioRef.current.pause()
    else {
      if (startTime !== undefined) audioRef.current.currentTime = startTime  // thêm
      audioRef.current.play().catch(() => { })
    }
  }

  // ─── Effect: reset on URL change ─────────────────────────────────────────────

  useEffect(() => {
    stopRaf()
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }

    setIsPlaying(false)
    setDuration('0:00')
    applyProgress(0)
    applyCurrentTime(0)

    if (!url) return

    const audio = initAudio()

    if (autoPlay) {
      timerRef.current = setTimeout(() => {
        audio?.play().catch(err => console.warn('Autoplay blocked:', err))
        timerRef.current = null
      }, delay)
    }

    return () => {
      stopRaf()
      if (timerRef.current) clearTimeout(timerRef.current)
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoPlay, delay])

  // ─── Render ───────────────────────────────────────────────────────────────────

  const PlayBtn = (
    <button
      onClick={togglePlay}
      disabled={isLoading || !url}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      className={cn(
        'rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
        variant === 'minimal' ? 'w-7 h-7' : 'w-6 h-6',
      )}
    >
      {isLoading
        ? <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
        : iconMap[(iconVariant ?? 'play') as AudioIconVariant](isPlaying)
      }
    </button>
  )

  if (variant === 'minimal') {
    return <div className={cn('inline-block', className)}>{PlayBtn}</div>
  }

  return (
    <div className={cn('flex items-center gap-2 py-2.5 w-full', className)}>
      {PlayBtn}

      {/* Current time — updated via ref, no re-render */}
      <span ref={currentTimeRef} className="text-[10px] font-medium text-muted-foreground w-7 tabular-nums">
        0:00
      </span>

      {/* Seek bar */}
      <div
        ref={seekBarRef}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressRef.current)}
        aria-label="Audio seek bar"
        tabIndex={0}
        className="flex-1 h-1.5 bg-indigo-100 rounded-full cursor-pointer relative"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onKeyDown={e => {
          const audio = audioRef.current
          if (!audio || !isFinite(audio.duration)) return
          if (e.key === 'ArrowRight') seekTo((audio.currentTime + 5) / audio.duration)
          if (e.key === 'ArrowLeft') seekTo(Math.max(0, audio.currentTime - 5) / audio.duration)
        }}
      >
        {/* Fill */}
        <div
          ref={fillRef}
          className="absolute inset-y-0 left-0 bg-indigo-400 rounded-full pointer-events-none"
          style={{ width: '0%' }}
        />
        {/* Thumb — always visible */}
        <div
          ref={thumbRef}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full pointer-events-none',
            'bg-white border-2 border-indigo-500 shadow-sm',
            'transition-transform duration-100 hover:scale-125',
          )}
          style={{ left: 'calc(0% - 6px)' }}
        />
      </div>

      {/* Total duration — fixed */}
      <span className="text-[10px] font-medium text-muted-foreground w-7 text-right tabular-nums">
        {duration}
      </span>
    </div>
  )
}
'use client'

import { MIN_RECORDING_SECONDS, SPEAKING_TIME } from '@/constants'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseRecordingCountdownOptions {
  part: number
  isRecording: boolean
  onAutoStop: () => void
}

export function useRecordingCountdown({
  part,
  isRecording,
  onAutoStop,
}: UseRecordingCountdownOptions) {
  const maxTime = SPEAKING_TIME[part] ?? 30
  const [countdown, setCountdown] = useState(maxTime)
  const [canStop, setCanStop] = useState(false)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stopLockRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoStoppedRef = useRef(false)

  const cleanup = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    if (stopLockRef.current) {
      clearTimeout(stopLockRef.current)
      stopLockRef.current = null
    }
  }, [])

  const startCountdown = useCallback(() => {
    cleanup()
    autoStoppedRef.current = false
    setCanStop(false)
    setCountdown(maxTime)

    stopLockRef.current = setTimeout(
      () => setCanStop(true),
      MIN_RECORDING_SECONDS * 1000,
    )

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [maxTime, cleanup])

  // Auto-stop khi hết giờ
  useEffect(() => {
    if (isRecording && countdown <= 0 && !autoStoppedRef.current) {
      autoStoppedRef.current = true
      cleanup()
      setCanStop(true)
      onAutoStop()
    }
  }, [countdown, isRecording, onAutoStop, cleanup])

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup])

  return {
    countdown,
    maxTime,
    canStop,
    startCountdown,
    stopCountdown: cleanup,
  }
}

import { useEffect, useRef, useState } from 'react'

export default function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(seconds)
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [seconds])

  const minutes = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const isExpired = remaining === 0

  return { remaining, display, isExpired }
}

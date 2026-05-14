'use client'

import { AUDIO_PURPOSE, SPEAKING_SESSION_MODE } from '@/constants'
import { useCreateAttemptMutation } from '@/queries/attempt.query'
import { useUploadAudioMutation } from '@/queries/file.query'
import { useGetCurrentQuestionQuery } from '@/queries/speaking-session.query'
import { SessionState, UploadAudioBodyType } from '@/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useMockTestSession(sessionId: string) {
  const [state, setState] = useState<SessionState>('fetching')
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [isReplayingQuestion, setIsReplayingQuestion] = useState(false)

  const {
    data: res,
    refetch,
    isLoading,
  } = useGetCurrentQuestionQuery(sessionId)
  const questionData = res?.data

  const uploadAudioMutation = useUploadAudioMutation()
  const createAttemptMutation = useCreateAttemptMutation()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  const playAudio = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => resolve()
      audio.onerror = () => reject()
      audio.play().catch(reject)
    })
  }, [])

  const startTransitionTimer = useCallback(() => {
    clearTimer()
    setPrepSeconds(3)
    timerRef.current = window.setInterval(() => {
      setPrepSeconds((prev) => {
        if (prev <= 1) {
          clearTimer()
          setState('user_speaking')
          return 0
        }

        return prev - 1
      })
    }, 1000)
  }, [clearTimer])

  useEffect(() => {
    if (!questionData) return

    const cleanup = () => {
      clearTimer()
      stopAudio()
    }

    if (state === 'fetching') {
      if (questionData.isFinished) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState('done')
      } else {
        const questionId = questionData.question?.id
        const lastReadId = sessionStorage.getItem(`mock_${sessionId}_lastRead`)

        if (questionId && lastReadId === questionId) {
          setState(questionData.question?.part === 2 ? 'prep' : 'transition')
        } else {
          if (questionId) {
            sessionStorage.setItem(`mock_${sessionId}_lastRead`, questionId)
          }
          setState('examiner_speaking')
        }
      }
    }

    if (state === 'examiner_speaking') {
      const playSequence = async () => {
        try {
          if (questionData.instruction) {
            await playAudio(questionData.instruction)
          }
          if (questionData.question?.audioUrl) {
            await playAudio(questionData.question.audioUrl)
          }
          if (questionData.question?.part === 2) {
            setState('prep')
          } else {
            setState('transition')
          }
        } catch {
          toast.error('Khong the phat am thanh cua giam khao')
          setState('transition')
        }
      }
      playSequence()
    }

    if (state === 'transition') {
      startTransitionTimer()
    }

    if (state === 'prep') {
      clearTimer()
      setPrepSeconds(60)
      timerRef.current = window.setInterval(() => {
        setPrepSeconds((prev) => {
          if (prev <= 1) {
            clearTimer()
            setState('transition')
            return 0
          }

          return prev - 1
        })
      }, 1000)
    }

    if (state === 'done') {
      const finish = async () => {
        if (questionData.instruction) {
          try {
            await playAudio(questionData.instruction)
          } catch {
            // ignore
          }
        }
        toast.success('Chuc mung ban da hoan thanh bai thi!')
      }
      finish()
    }

    return cleanup
  }, [
    state,
    questionData,
    sessionId,
    clearTimer,
    stopAudio,
    startTransitionTimer,
    playAudio,
  ])

  const submitAttempt = async (
    audioBlob: Blob,
  ): Promise<{ success: boolean; errorCode?: string }> => {
    setState('submitting')
    try {
      if (!questionData?.question?.id) throw new Error('No question ID')

      const file = new File([audioBlob], 'recording.webm', {
        type: 'audio/webm',
      })
      const uploadPayload: UploadAudioBodyType = {
        audio: file,
        purpose: AUDIO_PURPOSE.MOCK_TEST,
      }
      const uploadRes = await uploadAudioMutation.mutateAsync(uploadPayload)
      const audioFileId = uploadRes.data.id

      const attemptRes = await createAttemptMutation.mutateAsync({
        mode: SPEAKING_SESSION_MODE.MOCK,
        forecastQuestionId: questionData.question.id,
        audioFileId,
      })

      if (attemptRes.errorCode === 'BUS_003') {
        setState('user_speaking')
        return { success: false, errorCode: 'BUS_003' }
      }

      setState('fetching')
      await refetch()
      return { success: true }
    } catch {
      toast.error('Nop cau tra loi that bai')
      setState('user_speaking')
      return { success: false }
    }
  }

  const replayQuestion = async () => {
    const questionId = questionData?.question?.id
    const audioUrl = questionData?.question?.audioUrl
    if (!questionId || !audioUrl || state !== 'transition') return

    clearTimer()
    setIsReplayingQuestion(true)

    try {
      await playAudio(audioUrl)
      sessionStorage.setItem(`mock_${sessionId}_replayed_${questionId}`, 'true')
    } catch {
      toast.error('Khong the phat lai cau hoi')
    } finally {
      setIsReplayingQuestion(false)
      startTransitionTimer()
    }
  }

  const hasReplayed = !!sessionStorage.getItem(
    `mock_${sessionId}_replayed_${questionData?.question?.id}`,
  )

  return {
    state,
    questionData,
    prepSeconds,
    isLoading,
    submitAttempt,
    replayQuestion,
    hasReplayed,
    isReplayingQuestion,
  }
}

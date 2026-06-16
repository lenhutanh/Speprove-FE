'use client'

import { AUDIO_PURPOSE, SPEAKING_SESSION_MODE } from '@/constants'
import { useCreateAttemptMutation } from '@/queries/attempt.query'
import { useUploadAudioMutation } from '@/queries/file.query'
import { useGetCurrentQuestionQuery } from '@/queries/speaking-session.query'
import { SessionState, UploadAudioBodyType } from '@/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useMockTestSession(
  sessionId: string,
  hasEntered: boolean = true,
) {
  const [state, setState] = useState<SessionState>('fetching')
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [isReplayingQuestion, setIsReplayingQuestion] = useState(false)
  const lastSubmittedQuestionIdRef = useRef<string | null>(null)

  const {
    data: res,
    refetch,
    isLoading,
    isError,
    isFetching,
  } = useGetCurrentQuestionQuery(sessionId, { enabled: hasEntered })
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

  const questionId = questionData?.question?.id
  const isFinished = questionData?.isFinished
  const instruction = questionData?.instruction
  useEffect(() => {
    if (!hasEntered) return
    if (!questionData) return

    let active = true

    const cleanup = () => {
      active = false
      clearTimer()
      stopAudio()
    }

    if (state === 'fetching') {
      if (questionId && questionId === lastSubmittedQuestionIdRef.current) {
        return
      }

      lastSubmittedQuestionIdRef.current = null

      if (isFinished) {
        const doneRead = sessionStorage.getItem(`mock_${sessionId}_doneRead`)
        if (instruction && doneRead !== 'true') {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setState('examiner_speaking')
        } else {
          setState('done')
        }
      } else {
        const lastReadId = sessionStorage.getItem(`mock_${sessionId}_lastRead`)

        if (questionId && lastReadId === questionId) {
          setState(questionData.question?.part === 2 ? 'prep' : 'transition')
        } else {
          setState('examiner_speaking')
        }
      }
    }

    if (state === 'examiner_speaking') {
      const playSequence = async () => {
        try {
          if (instruction) {
            await playAudio(instruction)
          }
          if (!active) return

          if (isFinished) {
            sessionStorage.setItem(`mock_${sessionId}_doneRead`, 'true')
            setState('done')
            return
          }

          if (questionData.question?.audioUrl) {
            await playAudio(questionData.question.audioUrl)
          }
          if (!active) return

          if (questionId) {
            sessionStorage.setItem(`mock_${sessionId}_lastRead`, questionId)
          }

          if (questionData.question?.part === 2) {
            setState('prep')
          } else {
            setState('transition')
          }
        } catch {
          if (!active) return
          toast.error('Khong the phat am thanh cua giam khao')

          if (isFinished) {
            sessionStorage.setItem(`mock_${sessionId}_doneRead`, 'true')
            setState('done')
          } else {
            setState('transition')
          }
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

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasEntered,
    state,
    questionId,
    isFinished,
    instruction,
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
        speakingSessionId: sessionId,
      })

      if (attemptRes.errorCode === 'BUS_003') {
        setState('user_speaking')
        return { success: false, errorCode: 'BUS_003' }
      }

      lastSubmittedQuestionIdRef.current = questionData.question.id

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
    isError,
    isFetching,
    refetch,
    submitAttempt,
    replayQuestion,
    hasReplayed,
    isReplayingQuestion,
  }
}

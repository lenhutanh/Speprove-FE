'use client'

import { AUDIO_PURPOSE, SPEAKING_SESSION_MODE } from '@/constants'
import { useCreateAttemptMutation } from '@/queries/attempt.query'
import { useUploadAudioMutation } from '@/queries/file.query'
import { useGetCurrentQuestionQuery } from '@/queries/speaking-session.query'
import { SessionState, UploadAudioBodyType } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useMockTestSession(sessionId: string) {
  const [state, setState] = useState<SessionState>('fetching')
  const [prepSeconds, setPrepSeconds] = useState(60)

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

  useEffect(() => {
    if (!questionData) return

    const cleanup = () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
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
            // eslint-disable-next-line react-hooks/immutability
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
        } catch (error) {
          toast.error('Không thể phát âm thanh của giám khảo')
          setState('transition')
        }
      }
      playSequence()
    }

    if (state === 'transition') {
      setPrepSeconds(3)
      timerRef.current = window.setInterval(() => {
        setPrepSeconds((prev) => {
          if (prev <= 1) {
            window.clearInterval(timerRef.current!)
            setState('user_speaking')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    if (state === 'prep') {
      setPrepSeconds(60)
      timerRef.current = window.setInterval(() => {
        setPrepSeconds((prev) => {
          if (prev <= 1) {
            window.clearInterval(timerRef.current!)
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
          } catch (e) {
            // ignore
          }
        }
        toast.success('Chúc mừng bạn đã hoàn thành bài thi!')
        // navigate(`${route.mockTest}/${sessionId}/result`)
      }
      finish()
    }

    return cleanup
  }, [state, questionData, sessionId])

  const playAudio = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => resolve()
      audio.onerror = () => reject()
      audio.play().catch(reject)
    })
  }

  const submitAttempt = async (
    audioBlob: Blob,
  ): Promise<{ success: boolean; errorCode?: string }> => {
    setState('submitting')
    try {
      if (!questionData?.question?.id) throw new Error('No question ID')

      // 1. Upload audio
      const file = new File([audioBlob], 'recording.webm', {
        type: 'audio/webm',
      })
      const uploadPayload: UploadAudioBodyType = {
        audio: file,
        purpose: AUDIO_PURPOSE.MOCK_TEST,
      }
      const uploadRes = await uploadAudioMutation.mutateAsync(uploadPayload)
      const audioFileId = uploadRes.data.id

      // 2. Submit Attempt
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
    } catch (error) {
      toast.error('Nộp câu trả lời thất bại')
      setState('user_speaking')
      return { success: false }
    }
  }

  const replayQuestion = () => {
    const replayKey = `mock_${sessionId}_replayed_${questionData?.question?.id}`
    sessionStorage.setItem(replayKey, 'true')
    setState('examiner_speaking')
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
  }
}

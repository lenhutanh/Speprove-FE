import { createSpeakingSessionSchema } from '@/validations'
import z from 'zod'

export type CreateSpeakingSessionRequest = z.infer<
  typeof createSpeakingSessionSchema
>

export type SpeakingResult = {
  fluency: number | null
  lexical: number | null
  grammar: number | null
  pronunciation: number | null
  overall: number | null
}

export const SESSION_STATUS = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  PROCESSING: 2,
  COMPLETED: 3,
  FAILED: 4,
} as const

export type SpeakingSessionStatus =
  (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS]

export type SpeakingSessionResponseDto = {
  id: string
  userId: string
  forecastId: string
  voiceId: string
  type: string
  status: SpeakingSessionStatus
  result?: {
    fluency: number | null
    lexical: number | null
    grammar: number | null
    pronunciation: number | null
    overall: number | null
  }
  startedAt: Date
  finishedAt?: Date
  refundedAt?: Date
  scoringQueuedAt?: Date
  retryCount?: number
}

export type SessionState =
  | 'fetching'
  | 'examiner_speaking'
  | 'prep'
  | 'user_speaking'
  | 'transition'
  | 'examiner_closing'
  | 'submitting'
  | 'scoring'
  | 'done'

export type CurrentQuestionResponse = {
  isFinished: boolean
  instruction: string | null
  mode: string
  questionIndex: number
  totalQuestions: number
  question: {
    id: string
    part: number
    content: string
    audioUrl: string
    bulletPoints?: string[]
  } | null
}

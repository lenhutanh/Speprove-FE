import { MOCK_TYPE, SPEAKING_SESSION_MODE } from '@/constants'
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

interface BaseSpeakingSession {
  id: string
  userId: string
  forecastId: string
  status: number
  result?: SpeakingResult
  startedAt: string
  finishedAt?: string
}

export type PracticeSessionResponse = BaseSpeakingSession & {
  mode: typeof SPEAKING_SESSION_MODE.PRACTICE
  mockType?: never
  part?: never
}

export type MockSessionResponse = BaseSpeakingSession & {
  mode: typeof SPEAKING_SESSION_MODE.MOCK
  mockType: typeof MOCK_TYPE
  part?: number // 1 | 2 | 3
}

export type SpeakingSessionResponseDto =
  | PracticeSessionResponse
  | MockSessionResponse

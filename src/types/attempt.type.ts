import { createAttemptSchema } from '@/validations'
import z from 'zod'

export type CreateAttemptBodyType = z.infer<typeof createAttemptSchema>

export type AttemptResponseDto = {
  status: number
  id: string
  speakingSessionId: string
  forecastQuestionId: string
  audioFileId: string
  createdAt: string
}

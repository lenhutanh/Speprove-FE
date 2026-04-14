import { SPEAKING_SESSION_MODE } from '@/constants'
import z, { nativeEnum } from 'zod'

export const createAttemptSchema = z.object({
  mode: nativeEnum(SPEAKING_SESSION_MODE),
  forecastQuestionId: z.string(),
  audioFileId: z.string(),
})

export const attemptQuerySchema = z.object({
  forecastQuestionId: z.string(),
})

import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  SPEAKING_SESSION_MODE,
} from '@/constants'
import z, { nativeEnum } from 'zod'

export const createAttemptSchema = z.object({
  mode: nativeEnum(SPEAKING_SESSION_MODE),
  forecastQuestionId: z.string(),
  audioFileId: z.string(),
})

export const attemptQuerySchema = z.object({
  forecastQuestionId: z.string(),
})

export const getLeaderboardQuerySchema = z.object({
  forecastQuestionId: z.string(),
  band: z.coerce.number().int().min(6).max(8),
})

export const getWordAudioQuerySchema = z.object({
  wordIndex: z.coerce.number().int().min(0),
  voiceId: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
})

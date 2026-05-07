import { SPEAKING_SESSION_TYPE } from '@/constants'
import z from 'zod'

export const createSpeakingSessionSchema = z.object({
  voiceId: z.string().optional(),
  type: z.nativeEnum(SPEAKING_SESSION_TYPE),
})

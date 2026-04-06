import { MOCK_TYPE, SPEAKING_SESSION_MODE } from '@/constants'
import z from 'zod'

export const createSpeakingSessionSchema = z.discriminatedUnion('mode', [
  z.object({
    forecastId: z.string(),
    mode: z.literal(SPEAKING_SESSION_MODE.PRACTICE),
  }),
  z
    .object({
      forecastId: z.string(),
      mode: z.literal(SPEAKING_SESSION_MODE.MOCK),
      mockType: z.enum([MOCK_TYPE.PART, MOCK_TYPE.FULL]),
      part: z.number().min(1).max(3).nullable().optional(),
    })
    .refine(
      (data) => {
        if (data.mockType === MOCK_TYPE.PART) return data.part != null
        return data.part == null
      },
      {
        message:
          'Part is required for MOCK_TYPE.PART and must be null for MOCK_TYPE.FULL',
        path: ['part'],
      },
    ),
])

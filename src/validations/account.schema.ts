import {
  ACCOUNT_TAB_KEYS,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from '@/constants'
import { z } from 'zod'

export const accountPageSchema = z.object({
  tab: z.enum(ACCOUNT_TAB_KEYS).default('profile'),
})

export const updateProfileSchema = z.object({
  avatarId: z
    .string()
    .regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE)
    .nullable()
    .optional(),
  fullName: z.string().min(1).max(256).optional(),
})

export const selectVoiceSchema = z.object({
  selectedVoiceId: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
})

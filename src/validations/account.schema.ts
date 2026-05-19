import { ACCOUNT_TAB_KEYS } from '@/constants'
import { z } from 'zod'

export const accountPageSchema = z.object({
  tab: z.enum(ACCOUNT_TAB_KEYS).default('profile'),
})

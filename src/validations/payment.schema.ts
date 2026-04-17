import { PAYMENT_METHOD } from '@/constants'
import z from 'zod'

export const createPaymentSchema = z.object({
  packageId: z.string(),
  method: z.enum(Object.values(PAYMENT_METHOD) as [string, ...string[]]),
})

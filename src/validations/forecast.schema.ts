import z from 'zod'
import { baseQuerySchema } from './base.query'

export const forecastQuerySchema = baseQuerySchema.extend({
  quarter: z.coerce.number().min(1).max(3).optional(),
})

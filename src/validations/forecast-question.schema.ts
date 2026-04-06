import z from 'zod'
import { baseQuerySchema } from './base.query'

export const forecastQuestionQuerySchema = baseQuerySchema.extend({
  part: z
    .union([
      z.coerce.number().min(1).max(3),
      z.string().regex(/^[1-3](,[1-3])*$/),
    ])
    .default(1),
  category: z.string().optional(),
})

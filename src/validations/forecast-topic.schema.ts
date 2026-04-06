import z from 'zod'
import { baseQuerySchema } from './base.query'

export const forecastTopicQuerySchema = baseQuerySchema.extend({
  forecastId: z.string(),
})

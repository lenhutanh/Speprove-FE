import { PART_GROUP } from '@/constants'
import z from 'zod'
import { baseQuerySchema, paginationSchema } from './base.query'

export const forecastDetailQuerySchema = baseQuerySchema
  .extend({
    part: z.nativeEnum(PART_GROUP).default(PART_GROUP.PART1),
  })
  .merge(paginationSchema)

export const forecastListQuerySchema = baseQuerySchema.extend({
  year: z.coerce
    .number()
    .int()
    .min(2025)
    .max(new Date().getFullYear() + 1)
    .optional(),
  quarter: z.coerce.number().int().min(1).max(3).optional(),
})

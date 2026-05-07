import z from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
})

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export const searchSchema = z.object({
  search: z.string().optional(),
})

export const baseQuerySchema = paginationSchema
  .merge(sortSchema)
  .merge(searchSchema)

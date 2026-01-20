import z from 'zod'

export const baseSearchSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
})

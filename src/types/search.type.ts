import { baseSearchSchema } from '@/schemaValidations'
import z from 'zod'

export type BaseSearchType = z.infer<typeof baseSearchSchema>

import { forecastTopicQuerySchema } from '@/validations'
import z from 'zod'

export type ForecastTopicQueryType = z.infer<typeof forecastTopicQuerySchema>

export type ForecastTopicType = {
  id: string
  forecastId: string
  order: number
  topicId: string
  name: string
  slug: string
}

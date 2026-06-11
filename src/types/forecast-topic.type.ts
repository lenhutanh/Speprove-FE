import { forecastTopicQuerySchema } from '@/validations'
import z from 'zod'
import { ForecastSummaryType } from './forecast.type'
import { TopicType } from './topic.type'

export type ForecastTopicQueryType = z.infer<typeof forecastTopicQuerySchema>

export type ForecastTopicType = {
  id: string
  forecast: ForecastSummaryType
  order: number
  topic: TopicType
  name: string
  slug: string
}

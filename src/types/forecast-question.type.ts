import { forecastQuestionQuerySchema } from '@/validations'
import z from 'zod'
import type { ForecastSummaryType } from './forecast.type'
import type { TopicType } from './topic.type'

export type ForecastQuestionQueryType = z.infer<
  typeof forecastQuestionQuerySchema
> & {
  forecastId: string
  forecastTopicId?: string
  part?: string
  category?: string
}

type BaseForecastQuestion = {
  id: string
  forecast: ForecastSummaryType
  forecastTopicId?: string
  forecastTopic?: ForecastTopicSummaryType | null
  questionId: string
  order: number
  content: string
  practicedAt?: string | null
  band?: number | string | null
  prev?: { id: string; content: string } | null
  next?: { id: string; content: string } | null
}

export type ForecastTopicSummaryType = {
  id: string
  topic: TopicType
}

export type ForecastQuestionType = BaseForecastQuestion &
  (
    | {
        part: 1
      }
    | {
        part: 2
        category: string
        bulletPoints: string[]
        childPart3?: ForecastQuestionType[]
      }
    | {
        part: 3
        parentId?: string
        parent?: ForecastQuestionType
      }
  )

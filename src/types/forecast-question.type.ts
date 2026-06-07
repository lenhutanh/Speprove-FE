import { forecastQuestionQuerySchema } from '@/validations'
import z from 'zod'

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
  forecastTopicId?: string
  questionId: string
  order: number
  content: string
  practicedAt?: string | null
  band?: number | string | null
  prev?: { id: string; content: string } | null
  next?: { id: string; content: string } | null
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

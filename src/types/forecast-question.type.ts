import { forecastQuestionQuerySchema } from '@/validations'
import z from 'zod'

export type ForecastQuestionQueryType = z.infer<
  typeof forecastQuestionQuerySchema
> & {
  forecastTopicId: string
}

type BaseForecastQuestion = {
  id: string
  forecastTopicId: string
  questionId: string
  order: number
  content: string
  practicedAt?: string | null
  band?: number | string | null
  audioUrl: string
  prev?: { id: string; content: string }
  next?: { id: string; content: string }
}

export type ForecastQuestionType = BaseForecastQuestion &
  (
    | { part: 1 }
    | {
        part: 2
        category: string
        bulletPoints: string[]
        childPart3?: ForecastQuestionType[]
      }
    | {
        part: 3
        parent?: ForecastQuestionType
      }
  )

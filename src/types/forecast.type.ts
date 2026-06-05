import { forecastListQuerySchema } from '@/validations'
import z from 'zod'

export type ForecastType = {
  id: string
  name: string
  slug: string
  quarter: number
  year: number
  thumbnail: string | null
  description: string | null
  validFrom: string
  validTo: string
  isActive: boolean
  createdAt: string

  stats?: {
    totalQuestions: number
    totalTopics: number
    practicedQuestions: number
    completedTopics: number
  }
}

export type ForecastQueryType = z.infer<typeof forecastListQuerySchema>

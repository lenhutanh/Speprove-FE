import { BaseSearchType } from './search.type'

export type ForecastResType = {
  name: string
  slug: string
  description: string
  thumbnail: string
  quarter: number
  year: number
  status: number
}

export type ForecastSearchType = {
  status?: number
} & BaseSearchType

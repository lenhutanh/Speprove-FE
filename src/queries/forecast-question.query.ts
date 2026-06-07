import { forecastQuestionApiRequest } from '@/api-requests'
import { ForecastQuestionQueryType } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useForecastQuestionListQuery = ({
  enabled = false,
  params,
}: {
  enabled: boolean
  params: ForecastQuestionQueryType
}) => {
  return useQuery({
    queryKey: ['forecast-question-list', params],
    queryFn: () => forecastQuestionApiRequest.getList(params),
    enabled,
  })
}

export const useForecastQuestionQuery = (id: string) => {
  return useQuery({
    queryKey: ['forecast-question', id],
    queryFn: () => forecastQuestionApiRequest.getById(id),
    enabled: !!id,
  })
}

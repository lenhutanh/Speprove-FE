import { forecastTopicApiRequest } from '@/api-requests'
import { ForecastTopicQueryType } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useForecastTopicListQuery = ({
  enabled = false,
  params,
  placeholderData,
}: {
  params: ForecastTopicQueryType
  enabled: boolean
  placeholderData?: (prev: any) => any
}) => {
  return useQuery({
    queryKey: ['forecast-topic-list', params],
    queryFn: () => forecastTopicApiRequest.getList(params),
    enabled,
    placeholderData,
  })
}

export const useForecastTopicQuery = (id: string) => {
  return useQuery({
    queryKey: ['forecast-topic', id],
    queryFn: () => forecastTopicApiRequest.getById(id),
  })
}

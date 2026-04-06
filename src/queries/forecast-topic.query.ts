import { forecastTopicApiRequest } from '@/api-requests'
import { ForecastTopicQueryType } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useForecastTopicListQuery = ({
  enabled = false,
  params,
}: {
  params: ForecastTopicQueryType
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['forecast-topic-list', params],
    queryFn: () => forecastTopicApiRequest.getList(params),
    enabled,
  })
}

export const useForecastTopicQuery = (id: string) => {
  return useQuery({
    queryKey: ['forecast-topic', id],
    queryFn: () => forecastTopicApiRequest.getById(id),
  })
}

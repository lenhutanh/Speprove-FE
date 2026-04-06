import { forecastApiRequest } from '@/api-requests'
import { ForecastQueryType } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useForecastListQuery = ({
  enabled = false,
  params,
}: {
  params?: ForecastQueryType
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['forecast-list', params],
    queryFn: () => forecastApiRequest.getList(params),
    enabled,
  })
}

export const useForecastQuery = (id: string) => {
  return useQuery({
    queryKey: ['forecast', id],
    queryFn: () => forecastApiRequest.getById(id),
  })
}

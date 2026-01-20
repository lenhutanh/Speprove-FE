import { forecastApiRequest } from '@/api-requests'
import { ForecastSearchType } from '@/types'
import { useQuery } from '@tanstack/react-query'

export const useForecastListQuery = ({
  enabled = false,
  params,
}: {
  params?: ForecastSearchType
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['forecast-list', params],
    queryFn: () => forecastApiRequest.getList(params),
    enabled,
  })
}

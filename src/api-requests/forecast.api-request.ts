import { apiConfig } from '@/constants'
import { ApiResponse, ForecastQueryType, ForecastType } from '@/types'
import { http } from '@/utils'

const forecastApiRequest = {
  getList: (params?: ForecastQueryType) =>
    http.get<ApiResponse<ForecastType[]>>(apiConfig.forecast.getList, {
      params,
    }),
  getById: (id: string) =>
    http.get<ApiResponse<ForecastType>>(apiConfig.forecast.getById, {
      pathParams: { id },
    }),
}

export default forecastApiRequest

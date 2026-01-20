import { apiConfig } from '@/constants'
import { ApiResponse, ForecastResType, ForecastSearchType } from '@/types'
import { http } from '@/utils'

const forecastApiRequest = {
  getList: (params?: ForecastSearchType) =>
    http.get<ApiResponse<ForecastResType[]>>(apiConfig.forecast.getList, {
      params,
    }),
}

export default forecastApiRequest

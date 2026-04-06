import { apiConfig } from '@/constants'
import { ApiResponse, ForecastTopicQueryType, ForecastTopicType } from '@/types'
import { http } from '@/utils'

const forecastTopicApiRequest = {
  getList: (params: ForecastTopicQueryType) =>
    http.get<ApiResponse<ForecastTopicType[]>>(
      apiConfig.forecastTopic.getList,
      {
        params,
      },
    ),
  getById: (id: string) =>
    http.get<ApiResponse<ForecastTopicType>>(apiConfig.forecastTopic.getById, {
      pathParams: { id },
    }),
}

export default forecastTopicApiRequest

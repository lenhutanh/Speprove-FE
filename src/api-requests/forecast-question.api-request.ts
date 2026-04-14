import { apiConfig } from '@/constants'
import {
  ApiResponse,
  ForecastQuestionQueryType,
  ForecastQuestionType,
} from '@/types'
import { http } from '@/utils'

const forecastQuestionApiRequest = {
  getList: (params: ForecastQuestionQueryType) =>
    http.get<ApiResponse<ForecastQuestionType[]>>(
      apiConfig.forecastQuestion.getList,
      {
        params,
      },
    ),
  getById: (id: string, voiceId?: string | null) =>
    http.get<ApiResponse<ForecastQuestionType>>(
      apiConfig.forecastQuestion.getById,
      {
        pathParams: { id },
        params: { voiceId },
      },
    ),
}

export default forecastQuestionApiRequest

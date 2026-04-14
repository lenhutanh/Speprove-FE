import { apiConfig } from '@/constants'
import { ApiResponse, AttemptQueryType, AttemptResponseDto, CreateAttemptBodyType } from '@/types'
import { http } from '@/utils'

const attemptApiRequest = {
  create: (body: CreateAttemptBodyType) =>
    http.post<ApiResponse<AttemptResponseDto>>(apiConfig.attempt.create, {
      body,
    }),
  getDetails: (id: string) =>
    http.get<ApiResponse<AttemptResponseDto>>(apiConfig.attempt.getById, {
      pathParams: { id },
    }),
  getList: (params: AttemptQueryType) =>
    http.get<ApiResponse<AttemptResponseDto[]>>(apiConfig.attempt.getList, {
      params,
    }),
}

export default attemptApiRequest

import { apiConfig } from '@/constants'
import { ApiResponse, AttemptResponseDto, CreateAttemptBodyType } from '@/types'
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
}

export default attemptApiRequest

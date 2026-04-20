import { apiConfig } from '@/constants'
import {
  ApiResponse,
  AttemptLeaderBoardType,
  AttemptQueryType,
  AttemptResponseDto,
  CreateAttemptBodyType,
  GetLeaderboardQueryType,
} from '@/types'
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
  getLeaderBoard: (params: GetLeaderboardQueryType) =>
    http.get<ApiResponse<AttemptLeaderBoardType[]>>(
      apiConfig.attempt.getLeaderboard,
      {
        params,
      },
    ),
  toggleShare: (id: string, isPublic: boolean) =>
    http.put<ApiResponse<AttemptResponseDto>>(apiConfig.attempt.toggleShare, {
      pathParams: { id },
      body: { isPublic },
    }),
}

export default attemptApiRequest

import { apiConfig } from '@/constants'
import {
  ApiResponse,
  AttemptDetail,
  AttemptLeaderBoardType,
  AttemptListItem,
  AttemptQueryType,
  AttemptResponseDto,
  CreateAttemptBodyType,
  GetLeaderboardQueryType,
  GetWordAudioQueryType,
} from '@/types'
import { http } from '@/utils'

const attemptApiRequest = {
  create: (body: CreateAttemptBodyType) =>
    http.post<ApiResponse<AttemptResponseDto>>(apiConfig.attempt.create, {
      body,
    }),
  getDetails: (id: string) =>
    http.get<ApiResponse<AttemptDetail>>(apiConfig.attempt.getById, {
      pathParams: { id },
    }),
  getList: (params: AttemptQueryType) =>
    http.get<ApiResponse<AttemptListItem[]>>(apiConfig.attempt.getList, {
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
  getWordAudio: (id: string, params: GetWordAudioQueryType) =>
    http.get<ApiResponse<{ audioUrl: string }>>(
      apiConfig.attempt.getWordAudio,
      {
        pathParams: { id },
        params,
      },
    ),
}

export default attemptApiRequest

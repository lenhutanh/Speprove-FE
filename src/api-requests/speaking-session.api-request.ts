import { apiConfig } from '@/constants'
import {
  ApiResponse,
  CreateSpeakingSessionRequest,
  CurrentQuestionResponse,
  SpeakingSessionResponseDto,
} from '@/types'
import { http } from '@/utils'

const speakingSessionApiRequest = {
  create: (body: CreateSpeakingSessionRequest) =>
    http.post<ApiResponse<SpeakingSessionResponseDto>>(
      apiConfig.speakingSession.create,
      {
        body,
      },
    ),
  getCurrentQuestion: (id: string) =>
    http.get<ApiResponse<CurrentQuestionResponse>>(
      apiConfig.speakingSession.getCurrentQuestion,
      {
        pathParams: { id },
      },
    ),
  getList: () =>
    http.get<ApiResponse<SpeakingSessionResponseDto[]>>(
      apiConfig.speakingSession.getList,
    ),
  getDetails: (id: string) =>
    http.get<ApiResponse<SpeakingSessionResponseDto>>(
      apiConfig.speakingSession.getDetails,
      {
        pathParams: { id },
      },
    ),
  retry: (id: string) =>
    http.post<ApiResponse<SpeakingSessionResponseDto>>(
      apiConfig.speakingSession.retry,
      {
        pathParams: { id },
      },
    ),
}

export default speakingSessionApiRequest

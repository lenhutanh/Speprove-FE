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
}

export default speakingSessionApiRequest

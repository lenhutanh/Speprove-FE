import { apiConfig } from '@/constants'
import {
  ApiResponse,
  CreateSpeakingSessionRequest,
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
}

export default speakingSessionApiRequest

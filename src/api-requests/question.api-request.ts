import { apiConfig } from '@/constants'
import { ApiResponse } from '@/types'
import { http } from '@/utils'

const questApiRequest = {
  getQuestionAudio: (id: string, voiceId: string) =>
    http.get<ApiResponse<{ audioUrl: string }>>(
      apiConfig.question.getQuestionAudio,
      {
        pathParams: { id },
        params: { voiceId },
      },
    ),
}

export default questApiRequest

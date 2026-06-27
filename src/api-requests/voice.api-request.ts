import { apiConfig } from '@/constants'
import { ApiResponse, VoiceType } from '@/types'
import { http } from '@/utils'

const voiceApiRequest = {
  getDefault: () =>
    http.get<ApiResponse<VoiceType>>(apiConfig.voice.getDefault),
  getList: () => http.get<ApiResponse<VoiceType[]>>(apiConfig.voice.getList),
  getSampleAudio: (id: string) =>
    http.get<ApiResponse<{ audioUrl: string }>>(
      apiConfig.voice.getSampleAudio,
      {
        pathParams: { id },
      },
    ),
}

export default voiceApiRequest

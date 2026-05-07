import { apiConfig } from '@/constants'
import { ApiResponse, VoiceType } from '@/types'
import { http } from '@/utils'

const voiceApiRequest = {
  getDefault: () =>
    http.get<ApiResponse<VoiceType>>(apiConfig.voice.getDefault),
  getList: () => http.get<ApiResponse<VoiceType[]>>(apiConfig.voice.getList),
}

export default voiceApiRequest

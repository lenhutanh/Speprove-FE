import apiConfig from '@/constants/api-config'
import { ApiResponse, SelectVoiceBodyType, UpdateProfileType } from '@/types'
import { UserResType } from '@/types/account.type'
import { http } from '@/utils'

const authApiRequest = {
  getMe: () => http.get<ApiResponse<UserResType>>(apiConfig.account.getMe),
  updateProfile: (body: UpdateProfileType) =>
    http.put<ApiResponse<any>>(apiConfig.account.updateProfile, {
      body,
    }),
  selectVoice: (body: SelectVoiceBodyType) =>
    http.put<ApiResponse<any>>(apiConfig.account.selectVoice, {
      body,
    }),
}

export default authApiRequest

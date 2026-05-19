import apiConfig from '@/constants/api-config'
import { ApiResponse } from '@/types'
import { UserResType } from '@/types/account.type'
import { http } from '@/utils'

const authApiRequest = {
  getMe: () => http.get<ApiResponse<UserResType>>(apiConfig.account.getMe),
}

export default authApiRequest

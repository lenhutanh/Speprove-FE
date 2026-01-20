import apiConfig from '@/constants/api-config'
import { ApiResponse } from '@/types'
import { http } from '@/utils'

const authApiRequest = {
  getMe: () => http.get<ApiResponse<any>>(apiConfig.account.getMe),
}

export default authApiRequest

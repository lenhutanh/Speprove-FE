import apiConfig from '@/constants/api-config'
import {
  ApiResponse,
  LoginBodyType,
  RegisterBodyType,
  VerifyOtpBodyType,
} from '@/types'
import { http } from '@/utils'

const authApiRequest = {
  register: (body: RegisterBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.auth.register, {
      body,
    }),
  login: (body: LoginBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.auth.login, {
      body,
    }),
  verifyOtp: (body: VerifyOtpBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.auth.verifyOtp, {
      body,
    }),
  logout: () => http.post<ApiResponse<any>>(apiConfig.auth.logout),
}

export default authApiRequest

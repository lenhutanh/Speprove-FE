import apiConfig from '@/constants/api-config'
import {
  ApiResponse,
  ForgotPasswordType,
  LoginBodyType,
  RegisterBodyType,
  ResetPasswordType,
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
  verifyRegister: (body: VerifyOtpBodyType) =>
    http.post<ApiResponse<any>>(apiConfig.auth.verifyRegister, {
      body,
    }),
  logout: () => http.post<ApiResponse<any>>(apiConfig.auth.logout),
  forgotPassword: (body: ForgotPasswordType) =>
    http.post<ApiResponse<any>>(apiConfig.auth.forgotPassword, {
      body,
    }),
  verifyForgotPassword: (body: VerifyOtpBodyType) =>
    http.post<ApiResponse<{ resetToken: string }>>(
      apiConfig.auth.verifyForgotPassword,
      {
        body,
      },
    ),
  resetPassword: (body: ResetPasswordType) =>
    http.post<ApiResponse<any>>(apiConfig.auth.resetPassword, {
      body,
    }),
}

export default authApiRequest

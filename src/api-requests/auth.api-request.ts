import apiConfig from '@/constants/api-config'
import {
  ApiResponse,
  ChangePasswordType,
  ForgotPasswordType,
  LoginBodyType,
  RegisterBodyType,
  ResetPasswordType,
  SetPasswordType,
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
  changePassword: (body: ChangePasswordType) =>
    http.put<ApiResponse<any>>(apiConfig.auth.changePassword, {
      body,
    }),
  setPassword: (body: SetPasswordType) =>
    http.put<ApiResponse<any>>(apiConfig.auth.setPassword, {
      body,
    }),
  generateSocketTicket: () =>
    http.post<ApiResponse<{ ticket: string }>>(
      apiConfig.auth.generateSocketTicket,
    ),
}

export default authApiRequest

import AppConstants from '@/constants/app'
import { ApiConfigGroup } from '@/types'

const baseHeader = { 'Content-Type': 'application/json' }
const multipartHeader = { 'Content-Type': 'multipart/form-data' }

const defineApiConfig = <T extends ApiConfigGroup>(config: T) => config

const apiConfig = defineApiConfig({
  auth: {
    register: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/register`,
      headers: baseHeader,
      method: 'POST',
    },
    verifyOtp: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/verify-otp`,
      headers: baseHeader,
      method: 'POST',
    },
    forgotPassword: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/forgot-password`,
      headers: baseHeader,
      method: 'POST',
    },
    changePassword: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/change-password`,
      headers: baseHeader,
      method: 'POST',
    },
    login: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/login`,
      headers: baseHeader,
      method: 'POST',
    },
    resendOtp: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/resend-otp`,
      headers: baseHeader,
      method: 'POST',
    },
    logout: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/logout`,
      headers: baseHeader,
      method: 'POST',
    },
  },
  account: {
    getMe: {
      baseUrl: `${AppConstants.apiUrl}v1/account/me`,
      headers: baseHeader,
      method: 'GET',
    },
  },
  forecast: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/forecast`,
      method: 'GET',
      headers: baseHeader,
    },
  },
})

export default apiConfig

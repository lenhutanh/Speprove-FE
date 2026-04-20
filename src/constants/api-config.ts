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
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/forecast/:id`,
      method: 'GET',
      headers: baseHeader,
    },
  },
  forecastTopic: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/forecast-topic`,
      method: 'GET',
      headers: baseHeader,
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/forecast-topic/:id`,
      method: 'GET',
      headers: baseHeader,
    },
  },
  forecastQuestion: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/forecast-question`,
      method: 'GET',
      headers: baseHeader,
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/forecast-question/:id`,
      method: 'GET',
      headers: baseHeader,
    },
  },
  speakingSession: {
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/speaking-session`,
      method: 'POST',
      headers: baseHeader,
    },
  },
  file: {
    uploadAudio: {
      baseUrl: `${AppConstants.apiUrl}v1/file/upload-audio`,
      method: 'POST',
      headers: {},
      isUpload: true,
    },
  },
  attempt: {
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/attempt`,
      method: 'POST',
      headers: baseHeader,
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/attempt/:id`,
      method: 'GET',
      headers: baseHeader,
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/attempt`,
      method: 'GET',
      headers: baseHeader,
    },
    getLeaderboard: {
      baseUrl: `${AppConstants.apiUrl}v1/attempt/leaderboard`,
      method: 'GET',
      headers: baseHeader,
    },
    toggleShare: {
      baseUrl: `${AppConstants.apiUrl}v1/attempt/:id/share`,
      method: 'PUT',
      headers: baseHeader,
    },
  },
  voice: {
    getDefault: {
      baseUrl: `${AppConstants.apiUrl}v1/voice/default`,
      method: 'GET',
      headers: baseHeader,
    },
  },
  creditPackage: {
    getAll: {
      baseUrl: `${AppConstants.apiUrl}v1/credit-package`,
      method: 'GET',
      headers: baseHeader,
    },
  },
  payment: {
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/payment/:id`,
      method: 'GET',
      headers: baseHeader,
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/payment`,
      method: 'POST',
      headers: baseHeader,
    },
  },
})

export default apiConfig

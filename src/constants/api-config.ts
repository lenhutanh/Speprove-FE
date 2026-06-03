import AppConstants from '@/constants/app'
import { ApiConfigGroup } from '@/types'

const baseHeader = { 'Content-Type': 'application/json' }

const defineApiConfig = <T extends ApiConfigGroup>(config: T) => config

const apiConfig = defineApiConfig({
  auth: {
    register: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/register`,
      headers: baseHeader,
      method: 'POST',
    },
    verifyRegister: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/verify-register`,
      headers: baseHeader,
      method: 'POST',
    },
    forgotPassword: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/forgot-password`,
      headers: baseHeader,
      method: 'POST',
    },
    verifyForgotPassword: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/verify-forgot-password`,
      headers: baseHeader,
      method: 'POST',
    },
    resetPassword: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/reset-password`,
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
    changePassword: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/change-password`,
      headers: baseHeader,
      method: 'PUT',
    },
    setPassword: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/set-password`,
      headers: baseHeader,
      method: 'PUT',
    },
  },
  account: {
    getMe: {
      baseUrl: `${AppConstants.apiUrl}v1/account/me`,
      headers: baseHeader,
      method: 'GET',
    },
    updateProfile: {
      baseUrl: `${AppConstants.apiUrl}v1/account/update-profile`,
      headers: baseHeader,
      method: 'PUT',
    },
    selectVoice: {
      baseUrl: `${AppConstants.apiUrl}v1/account/select-voice`,
      headers: baseHeader,
      method: 'PUT',
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
    getCurrentQuestion: {
      baseUrl: `${AppConstants.apiUrl}v1/speaking-session/:id/current-question`,
      method: 'GET',
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
    uploadImage: {
      baseUrl: `${AppConstants.apiUrl}v1/file/upload-image`,
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
    getWordAudio: {
      baseUrl: `${AppConstants.apiUrl}v1/attempt/:id/word-audio`,
      method: 'GET',
      headers: baseHeader,
    },
  },
  voice: {
    getDefault: {
      baseUrl: `${AppConstants.apiUrl}v1/voice/default`,
      method: 'GET',
      headers: baseHeader,
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/voice`,
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

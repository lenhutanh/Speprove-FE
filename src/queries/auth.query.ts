import { authApiRequest } from '@/api-requests'
import route from '@/routes'
import { useAuthStore } from '@/store'
import {
  ForgotPasswordType,
  LoginBodyType,
  RegisterBodyType,
  VerifyOtpBodyType,
} from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: (body: RegisterBodyType) => authApiRequest.register(body),
  })
}

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (body: LoginBodyType) => authApiRequest.login(body),
  })
}

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationKey: ['verify-otp'],
    mutationFn: (body: VerifyOtpBodyType) => authApiRequest.verifyOtp(body),
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApiRequest.logout(),
    onSettled: () => {
      useAuthStore.getState().logout()
      queryClient.clear()
      window.location.href = route.home
    },
  })
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: (body: ForgotPasswordType) =>
      authApiRequest.forgotPassword(body),
  })
}

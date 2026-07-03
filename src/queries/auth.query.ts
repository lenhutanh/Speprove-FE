import { authApiRequest } from '@/api-requests'
import route from '@/routes'
import { useAuthStore } from '@/store'
import {
  ChangePasswordType,
  ForgotPasswordType,
  LoginBodyType,
  RegisterBodyType,
  ResetPasswordType,
  SetPasswordType,
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

export const useVerifyRegisterMutation = () => {
  return useMutation({
    mutationKey: ['verify-register'],
    mutationFn: (body: VerifyOtpBodyType) =>
      authApiRequest.verifyRegister(body),
  })
}

export const useVerifyForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ['verify-forgot-password'],
    mutationFn: (body: VerifyOtpBodyType) =>
      authApiRequest.verifyForgotPassword(body),
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

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: (body: ResetPasswordType) => authApiRequest.resetPassword(body),
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationKey: ['change-password'],
    mutationFn: (body: ChangePasswordType) =>
      authApiRequest.changePassword(body),
  })
}

export const useSetPasswordMutation = () => {
  return useMutation({
    mutationKey: ['set-password'],
    mutationFn: (body: SetPasswordType) => authApiRequest.setPassword(body),
  })
}

export const useGenerateSocketTicketMutation = () => {
  return useMutation({
    mutationKey: ['generate-socket-ticket'],
    mutationFn: () => authApiRequest.generateSocketTicket(),
  })
}

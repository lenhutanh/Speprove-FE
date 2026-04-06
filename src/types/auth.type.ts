import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from '@/validations/auth.schema'
import z from 'zod'
import { UserResType } from './account.type'

export type LoginBodyType = z.infer<typeof loginSchema>
export type RegisterBodyType = z.infer<typeof registerSchema>
export type VerifyOtpBodyType = z.infer<typeof verifyOtpSchema>
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>

export type AuthStoreType = {
  isAuthenticated: boolean
  user: UserResType | null
  isLoading: boolean
  setAuthenticated: (isAuthenticated: boolean) => void
  setUser: (user: UserResType | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

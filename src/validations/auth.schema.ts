import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OTP_RULE,
  OTP_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  REQUIRED_MESSAGE,
} from '@/constants'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, REQUIRED_MESSAGE)
    .regex(EMAIL_RULE, EMAIL_RULE_MESSAGE),
  password: z.string().min(8, PASSWORD_RULE_MESSAGE),
})

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, REQUIRED_MESSAGE)
      .regex(EMAIL_RULE, EMAIL_RULE_MESSAGE),

    password: z
      .string()
      .min(8, PASSWORD_RULE_MESSAGE)
      .regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE),

    confirmPassword: z.string().min(1, REQUIRED_MESSAGE),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, REQUIRED_MESSAGE)
    .regex(EMAIL_RULE, EMAIL_RULE_MESSAGE),
  otp: z.string().min(1, REQUIRED_MESSAGE).regex(OTP_RULE, OTP_RULE_MESSAGE),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, REQUIRED_MESSAGE)
    .regex(EMAIL_RULE, EMAIL_RULE_MESSAGE),
})

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, PASSWORD_RULE_MESSAGE)
      .regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE),
    confirmPassword: z.string().min(1, REQUIRED_MESSAGE),
    resetToken: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, PASSWORD_RULE_MESSAGE)
      .regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE),
    newPassword: z
      .string()
      .min(8, PASSWORD_RULE_MESSAGE)
      .regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE),
    confirmPassword: z.string().min(1, REQUIRED_MESSAGE),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, PASSWORD_RULE_MESSAGE)
      .regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE),
    confirmPassword: z.string().min(1, REQUIRED_MESSAGE),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

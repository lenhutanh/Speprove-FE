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

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, REQUIRED_MESSAGE)
    .regex(EMAIL_RULE, EMAIL_RULE_MESSAGE),
  password: z
    .string()
    .min(8, PASSWORD_RULE_MESSAGE)
    .regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE),
  confirmedPassword: z
    .string()
    .min(8, PASSWORD_RULE_MESSAGE)
    .regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE),
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

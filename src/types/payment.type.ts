import { createPaymentSchema } from '@/validations/payment.schema'
import z from 'zod'

export interface PaymentStatus {
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  points?: number
  balance?: number
}

export type CreatePaymentType = z.infer<typeof createPaymentSchema>

export type PaymentResponse = {
  id: string
  orderCode: number
  amount: number
  points: number
  status: string
  method: string
  expiredAt: Date
  createdAt: Date
  qrCode: string
  accountName: string
  accountNumber: string
  bin: string
  description: string
}

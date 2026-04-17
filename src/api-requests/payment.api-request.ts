import { apiConfig } from '@/constants'
import { ApiResponse, CreatePaymentType, PaymentResponse } from '@/types'
import { http } from '@/utils'

const paymentApiRequest = {
  create: (body: CreatePaymentType) =>
    http.post<ApiResponse<PaymentResponse>>(apiConfig.payment.create, {
      body,
    }),
  getById: (id: string) =>
    http.get<ApiResponse<PaymentResponse>>(apiConfig.payment.getById, {
      pathParams: { id },
    }),
}

export default paymentApiRequest

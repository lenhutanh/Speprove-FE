import { paymentApiRequest } from '@/api-requests'
import { CreatePaymentType } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationKey: ['create-payment'],
    mutationFn: (body: CreatePaymentType) => paymentApiRequest.create(body),
  })
}

export const usePaymentQuery = (
  id: string,
  options?: { refetchInterval?: number | false; enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentApiRequest.getById(id),
    ...options,
  })
}

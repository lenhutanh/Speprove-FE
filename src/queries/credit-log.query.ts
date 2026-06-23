import { creditLogApiRequest } from '@/api-requests'
import { CreditLogQueryParams } from '@/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useCreditLogListQuery = (
  params?: CreditLogQueryParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['credit-log-list', params],
    queryFn: () => creditLogApiRequest.getList(params),
    placeholderData: keepPreviousData,
    ...options,
  })
}

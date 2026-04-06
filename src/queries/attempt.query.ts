import attemptApiRequest from '@/api-requests/attempt.api-request'
import { CreateAttemptBodyType } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateAttemptMutation = () => {
  return useMutation({
    mutationKey: ['create-attempt'],
    mutationFn: (body: CreateAttemptBodyType) => attemptApiRequest.create(body),
  })
}

export const useAttemptQuery = (
  id: string,
  options?: { refetchInterval?: number | false; enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['attempt', id],
    queryFn: () => attemptApiRequest.getDetails(id),
    ...options,
  })
}

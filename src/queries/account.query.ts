import { accountApiRequest } from '@/api-requests'
import { useQuery } from '@tanstack/react-query'

export const useProfileQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => accountApiRequest.getMe(),
    enabled,
  })
}

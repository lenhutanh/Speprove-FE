import { accountApiRequest } from '@/api-requests'
import { useQuery } from '@tanstack/react-query'

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => accountApiRequest.getMe(),
    enabled: false,
  })
}

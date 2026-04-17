import { creditPackageApiRequest } from '@/api-requests'
import { useQuery } from '@tanstack/react-query'

export const useCreditPackageListQuery = () => {
  return useQuery({
    queryKey: ['credit-package-list'],
    queryFn: () => creditPackageApiRequest.getAll(),
  })
}

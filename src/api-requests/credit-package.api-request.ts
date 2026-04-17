import { apiConfig } from '@/constants'
import { ApiResponse, CreditPackage } from '@/types'
import { http } from '@/utils'

const creditPackageApiRequest = {
  getAll: () =>
    http.get<ApiResponse<CreditPackage[]>>(apiConfig.creditPackage.getAll),
}

export default creditPackageApiRequest

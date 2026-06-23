import { apiConfig } from '@/constants'
import {
  ApiResponse,
  CreditLogItem,
  CreditLogQueryParams,
  PaginationMeta,
} from '@/types'
import { http } from '@/utils'

const creditLogApiRequest = {
  getList: (params?: CreditLogQueryParams) =>
    http.get<
      ApiResponse<{ data: CreditLogItem[]; pagination: PaginationMeta }>
    >(apiConfig.creditLog.getList, {
      params,
    }),
}

export default creditLogApiRequest

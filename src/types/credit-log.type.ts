export interface CreditLogItem {
  id: string
  type: 'plus' | 'minus'
  amount: number
  description: string
  descriptionKey?: string
  descriptionMetadata?: Record<string, any>
  refType: 'payment' | 'usage' | 'refund' | 'manual'
  refId?: string
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

export type CreditLogQueryParams = {
  page?: number
  limit?: number
  search?: string
  refType?: string
  type?: string
  [key: string]: string | number | boolean | null | undefined
}

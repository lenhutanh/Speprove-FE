export interface CreditPackage {
  _id: string
  label: string
  amount: number
  points: number
  isActive: boolean
  badge?: string
  isHighlighted?: boolean
}

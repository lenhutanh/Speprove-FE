import { GroupResType } from './group.type'

export type UserResType = {
  id: string
  username: string
  email: string
  fullName?: string
  phone?: string
  kind: number
  avatarUrl?: string
  isSuperAdmin: boolean
  group: GroupResType
  status: number
  createdAt: string
  updatedAt: string
  selectedVoiceId: string
  balance: number
  hasPassword: boolean
}

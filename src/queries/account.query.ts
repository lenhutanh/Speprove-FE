import { accountApiRequest } from '@/api-requests'
import { SelectVoiceBodyType, UpdateProfileType } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useProfileQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => accountApiRequest.getMe(),
    enabled,
  })
}

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationKey: ['update-profile'],
    mutationFn: (body: UpdateProfileType) =>
      accountApiRequest.updateProfile(body),
  })
}

export const useSelectVoiceMutation = () => {
  return useMutation({
    mutationKey: ['select-voice'],
    mutationFn: (body: SelectVoiceBodyType) =>
      accountApiRequest.selectVoice(body),
  })
}

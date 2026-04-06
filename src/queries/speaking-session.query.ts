import { speakingSessionApiRequest } from '@/api-requests'
import { CreateSpeakingSessionRequest } from '@/types'
import { useMutation } from '@tanstack/react-query'

export const useCreateSpeakingSessionMutation = () => {
  return useMutation({
    mutationKey: ['create-speaking-session'],
    mutationFn: (body: CreateSpeakingSessionRequest) =>
      speakingSessionApiRequest.create(body),
  })
}

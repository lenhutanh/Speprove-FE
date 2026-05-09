import { speakingSessionApiRequest } from '@/api-requests'
import { CreateSpeakingSessionRequest } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateSpeakingSessionMutation = () => {
  return useMutation({
    mutationKey: ['create-speaking-session'],
    mutationFn: (body: CreateSpeakingSessionRequest) =>
      speakingSessionApiRequest.create(body),
  })
}

export const useGetCurrentQuestionQuery = (id: string) => {
  return useQuery({
    queryKey: ['get-current-question', id],
    queryFn: () => speakingSessionApiRequest.getCurrentQuestion(id),
  })
}

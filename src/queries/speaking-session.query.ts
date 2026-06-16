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

export const useGetCurrentQuestionQuery = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['get-current-question', id],
    queryFn: () => speakingSessionApiRequest.getCurrentQuestion(id),
    ...options,
  })
}

export const useSpeakingSessionListQuery = (options?: {
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['speaking-session-list'],
    queryFn: () => speakingSessionApiRequest.getList(),
    ...options,
  })
}

export const useSpeakingSessionQuery = (
  id: string,
  options?: { refetchInterval?: number | false; enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['speaking-session', id],
    queryFn: () => speakingSessionApiRequest.getDetails(id),
    ...options,
  })
}

import attemptApiRequest from '@/api-requests/attempt.api-request'
import {
  ApiResponse,
  AttemptListItem,
  AttemptQueryType,
  CreateAttemptBodyType,
  GetLeaderboardQueryType,
  GetWordAudioQueryType,
} from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateAttemptMutation = () => {
  return useMutation({
    mutationKey: ['create-attempt'],
    mutationFn: (body: CreateAttemptBodyType) => attemptApiRequest.create(body),
  })
}

export const useAttemptQuery = (
  id: string,
  options?: { refetchInterval?: number | false; enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['attempt', id],
    queryFn: () => attemptApiRequest.getDetails(id),
    ...options,
  })
}

export const useAttemptListQuery = ({
  enabled = false,
  params,
  refetchInterval,
}: {
  enabled: boolean
  params: AttemptQueryType
  refetchInterval?:
    | number
    | false
    | ((query: {
        state: { data?: ApiResponse<AttemptListItem[]> }
      }) => number | false)
}) => {
  return useQuery({
    queryKey: ['attempt-list', params],
    queryFn: () => attemptApiRequest.getList(params),
    enabled,
    refetchInterval,
  })
}

export const useToggleShareMutation = () => {
  return useMutation({
    mutationKey: ['toggle-share'],
    mutationFn: ({ id, isPublic }: { id: string; isPublic: boolean }) =>
      attemptApiRequest.toggleShare(id, isPublic),
  })
}

export const useLeaderboardQuery = ({
  enabled,
  params,
}: {
  enabled: boolean
  params: GetLeaderboardQueryType
}) => {
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: () => attemptApiRequest.getLeaderBoard(params),
    enabled,
  })
}

export const useGetWordAudioQuery = ({
  enabled,
  id,
  params,
}: {
  enabled: boolean
  id: string
  params: GetWordAudioQueryType
}) => {
  return useQuery({
    queryKey: ['attempt-word-audio', id, params],
    queryFn: () => attemptApiRequest.getWordAudio(id, params),
    enabled,
  })
}

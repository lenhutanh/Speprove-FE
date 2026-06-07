import { questionApiRequest } from '@/api-requests'
import { useQuery } from '@tanstack/react-query'

export const useGetQuestionAudioQuery = (id?: string, voiceId?: string) => {
  return useQuery({
    queryKey: ['question-audio', id, voiceId],
    queryFn: () => questionApiRequest.getQuestionAudio(id!, voiceId!),
    enabled: !!id && !!voiceId,
  })
}

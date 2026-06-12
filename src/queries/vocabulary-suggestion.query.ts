import { vocabularySuggestionApiRequest } from '@/api-requests'
import { VocabularyLevel } from '@/constants'
import { useQuery } from '@tanstack/react-query'

export const useGetVocabularySuggestionQuery = (
  questionId: string,
  level?: VocabularyLevel,
) => {
  return useQuery({
    queryKey: ['vocab-suggestion', questionId, level],
    queryFn: () =>
      vocabularySuggestionApiRequest.getVocabSuggestion({
        questionId,
        level,
      }),
    enabled: !!questionId,
  })
}

export const vocabularyAudioQueryKey = (id: string, voiceId: string) =>
  ['vocab-audio', id, voiceId] as const

export const getVocabularyAudioQueryOptions = (
  id: string,
  voiceId: string,
) => ({
  queryKey: vocabularyAudioQueryKey(id, voiceId),
  queryFn: () => vocabularySuggestionApiRequest.getVocabularyAudio(id, voiceId),
})

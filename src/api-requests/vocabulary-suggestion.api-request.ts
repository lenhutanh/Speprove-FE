import { apiConfig } from '@/constants'
import {
  ApiResponse,
  GetVocabSuggestionQueryType,
  VocabularySuggestionResponse,
} from '@/types'
import { http } from '@/utils'

const vocabularySuggestionApiRequest = {
  getVocabSuggestion: (params: GetVocabSuggestionQueryType) =>
    http.get<ApiResponse<VocabularySuggestionResponse>>(
      apiConfig.vocabularySuggestion.getVocabSuggestion,
      {
        params,
      },
    ),
  getVocabularyAudio: (id: string, voiceId: string) =>
    http.get<ApiResponse<{ audioUrl: string }>>(
      apiConfig.vocabularySuggestion.getVocabAudio,
      {
        pathParams: { id },
        params: { voiceId },
      },
    ),
}

export default vocabularySuggestionApiRequest

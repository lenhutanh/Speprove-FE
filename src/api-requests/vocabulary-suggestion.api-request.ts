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
}

export default vocabularySuggestionApiRequest

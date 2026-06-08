import { VocabularyLevel } from '@/constants'
import { getVocabSuggestionQuerySchema } from '@/validations'
import { z } from 'zod'

export type VocabularySuggestion = {
  id: string
  questionId: string
  text: string
  type: string
  meaning: string
  example: string
  level: VocabularyLevel
}

export type VocabularySuggestionResponse = VocabularySuggestion[]

export type GetVocabSuggestionQueryType = z.infer<
  typeof getVocabSuggestionQuerySchema
>

import {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  VOCABULARY_SUGGESTION_LEVEL,
} from '@/constants'
import { z } from 'zod'

export const getVocabSuggestionQuerySchema = z.object({
  questionId: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  level: z.enum(Object.values(VOCABULARY_SUGGESTION_LEVEL)).optional(),
})

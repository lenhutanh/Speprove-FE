import {
  attemptQuerySchema,
  createAttemptSchema,
  getLeaderboardQuerySchema,
  getWordAudioQuerySchema,
} from '@/validations'
import z from 'zod'

export type CreateAttemptBodyType = z.infer<typeof createAttemptSchema>

export type AttemptListItem = {
  id: string
  speakingSessionId?: string
  mode: string
  forecastQuestionId: string
  audioUrl?: string
  duration?: number
  part: number
  order: number
  status: number
  isPublic: boolean
  analysisProfile?: string
  analysisVersion?: string
  transcriptPreview?: string
  scores?: {
    overall?: number | null
    fluency?: number | null
    pronunciation?: number | null
    lexical?: number | null
    grammar?: number | null
  }
  analysisMeta?: {
    startedAt?: string
    finishedAt?: string
    currentStage?: string
    failedStage?: string
    error?: string
    warnings?: string[]
  }
  createdAt: string
  updatedAt: string
}

export type AttemptResponseDto = AttemptListItem

export type AttemptCriterionDetail = {
  strengths?: string | null
  limitations?: string | null
}

export type AttemptEvaluationIssue = {
  spanText?: string
  suggestion?: string
  correction?: string
  reason?: string
  severity?: 'minor' | 'major'
  startWordIndex?: number
  endWordIndex?: number
}

export type AttemptCoherenceIssue = {
  spanText?: string
  reason?: string
  severity?: 'minor' | 'major'
}

export type AttemptFluencyEvaluation = AttemptCriterionDetail & {
  band?: number | null
  deliveryBand?: number | null
  coherenceBand?: number | null
  coherenceIssues?: AttemptCoherenceIssue[]
}

export type AttemptPronunciationEvaluation = AttemptCriterionDetail & {
  band?: number | null
  confidence?: number | null
}

export type AttemptLexicalEvaluation = AttemptCriterionDetail & {
  band?: number | null
  issues?: AttemptEvaluationIssue[]
}

export type AttemptGrammarEvaluation = AttemptCriterionDetail & {
  band?: number | null
  issues?: AttemptEvaluationIssue[]
}

export type AttemptDetail = AttemptListItem & {
  transcript?: string
  evaluation?: {
    overall?: number | null
    fluency?: AttemptFluencyEvaluation
    pronunciation?: AttemptPronunciationEvaluation
    lexical?: AttemptLexicalEvaluation
    grammar?: AttemptGrammarEvaluation
    confidence?: number
    alignmentConfidence?: number
  }
  fluencyMetrics?: AttemptFluencyMetrics
  pronunciationScores?: Record<string, unknown>
  wordAssessments?: AttemptWordAssessment[]
  question?: {
    id: string
    title?: string
    content?: string
  }
}

export type AttemptFluencyMetrics = Record<string, unknown> & {
  speechDuration?: number
  wordCount?: number
  speechRate?: number
  pauseCount?: number
  fillerCount?: number
  fillers?: string[]
  repetitionCount?: number
  repetitions?: unknown[]
  longPauses?: AttemptPause[]
  pauses?: AttemptPause[]
}

export type AttemptPause = {
  startTime: number
  endTime: number
  duration: number
  afterWordIndex: number
}

export type AttemptWordAssessment = {
  wordIndex: number
  word: string
  accuracyScore?: number
  errorType?: string
  startTime?: number
  endTime?: number
  punctuationAfter?: string
  expectedIpa?: string
  spokenIpa?: string
  phonemes?: AttemptPhonemeAssessment[]
}

export type AttemptPhonemeAssessment = {
  phoneme?: string
  expectedIpa?: string
  spokenIpa?: string
  accuracyScore?: number
}

export type AttemptQueryType = z.infer<typeof attemptQuerySchema>

export type AttemptLeaderBoardType = {
  id: string
  audioUrl?: string
  duration?: number
  transcript?: string
  scores: {
    overall: number | null
    fluency: number | null
    pronunciation: number | null
    lexical: number | null
    grammar: number | null
  }
  user: {
    id: string
    fullName: string
    avatar?: string
  }
  createdAt: Date
}

export type GetLeaderboardQueryType = z.infer<typeof getLeaderboardQuerySchema>
export type GetWordAudioQueryType = z.infer<typeof getWordAudioQuerySchema>

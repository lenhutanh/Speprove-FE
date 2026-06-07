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

export type AttemptDetail = AttemptListItem & {
  transcript?: string
  evaluation?: {
    fluency?: unknown
    pronunciation?: unknown
    lexical?: unknown
    grammar?: unknown
    overall?: number | null
    confidence?: number
    alignmentConfidence?: number
  }
  fluencyMetrics?: AttemptFluencyMetrics
  pronunciationScores?: Record<string, unknown>
  wordAssessments?: AttemptWordAssessment[]
}

export type AttemptFluencyMetrics = Record<string, unknown> & {
  speechRate?: number
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

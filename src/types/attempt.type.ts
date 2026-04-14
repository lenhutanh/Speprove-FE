import { attemptQuerySchema, createAttemptSchema } from '@/validations'
import z from 'zod'

export type CreateAttemptBodyType = z.infer<typeof createAttemptSchema>

export type PhonemeInfo = {
  sound: string
  score: number
}

export type WordErrorType =
  | 'None'
  | 'Omission'
  | 'Insertion'
  | 'Mispronunciation'

export type Word = {
  wordIndex: number
  word: string
  sentenceIndex: number
  punctuationAfter: string
  isFiller: boolean
  isRepetition: boolean
  isScoreable: boolean
  errorType: WordErrorType
  score: number
  offset: number
  duration: number
  phonemes: PhonemeInfo[]
  spokenIpa: string
}

export type LongPause = {
  start: number
  end: number
  duration: number
  afterWordIndex: number
}

export type SpeechMetrics = {
  duration: number
  wordCount: number
  speechRate: number
  pauseCount: number
  longPauses: LongPause[]
  fillerCount: number
  fillers: string[]
  repetitionCount: number
  repetitions: string[]
  avgPronunciationScore: number
  prosodyScore: number
  words: Word[]
}

export type LexicalWeakWord = {
  startWordIndex: number
  endWordIndex: number
  original: string
  suggestion: string
  reason: string
}

export type GrammarError = {
  startWordIndex: number
  endWordIndex: number
  original: string
  correction: string
  reason: string
}

export type BandFeedback = {
  band: number
  feedback: string
}

export type Evaluation = {
  transcript: string
  fluency: BandFeedback | null
  pronunciation: BandFeedback | null
  lexical: (BandFeedback & { weakWords: LexicalWeakWord[] }) | null
  grammar: (BandFeedback & { errors: GrammarError[] }) | null
  overall: number | null
}

export type AttemptResponseDto = {
  id: string
  speakingSessionId?: string
  mode: string
  forecastQuestionId: string
  audioUrl?: string
  duration?: number
  part: number
  order: number
  status: number
  speechMetrics?: SpeechMetrics
  evaluation?: Evaluation
  createdAt: string
  updatedAt: string
}

export type AttemptQueryType = z.infer<typeof attemptQuerySchema>

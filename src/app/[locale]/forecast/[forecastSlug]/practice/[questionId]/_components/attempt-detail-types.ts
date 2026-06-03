import { AttemptDetail } from '@/types'

export type CriteriaTab = 'fluency' | 'pronunciation' | 'lexical' | 'grammar'

export type RangeIssue = {
  startWordIndex: number
  endWordIndex: number
  feedback?: string
  suggestion?: string
  correction?: string
  severity?: 'minor' | 'major'
}

export type PauseIssue = {
  startTime?: number
  endTime?: number
  afterWordIndex: number
  duration?: number
}

export const TAB_LABELS: Record<CriteriaTab, string> = {
  fluency: 'Fluency',
  pronunciation: 'Pron',
  lexical: 'Lexical',
  grammar: 'Grammar',
}

export const SCORE_KEYS: Record<
  CriteriaTab,
  keyof NonNullable<AttemptDetail['scores']>
> = {
  fluency: 'fluency',
  pronunciation: 'pronunciation',
  lexical: 'lexical',
  grammar: 'grammar',
}

export const HIGHLIGHT_CLASS: Record<CriteriaTab, string> = {
  fluency: 'bg-amber-100 text-amber-800 cursor-pointer hover:brightness-95',
  pronunciation:
    'bg-amber-100 text-amber-800 cursor-pointer hover:brightness-95',
  lexical: 'bg-amber-100 text-amber-800 cursor-pointer hover:brightness-95',
  grammar:
    'bg-red-100 text-red-800 underline decoration-wavy decoration-red-400 cursor-pointer hover:brightness-95',
}

export const ISSUE_SEVERITY_CLASS: Record<
  NonNullable<RangeIssue['severity']>,
  string
> = {
  minor: 'bg-amber-100 text-amber-800 cursor-pointer hover:brightness-95',
  major: 'bg-red-100 text-red-800 cursor-pointer hover:brightness-95',
}

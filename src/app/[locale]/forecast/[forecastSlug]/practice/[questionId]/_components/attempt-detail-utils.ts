import {
  AttemptDetail,
  AttemptEvaluationIssue,
  AttemptWordAssessment,
} from '@/types'
import {
  CriteriaTab,
  HIGHLIGHT_CLASS,
  PauseIssue,
  RangeIssue,
} from './attempt-detail-types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asNumber(value: unknown) {
  return typeof value === 'number' ? value : undefined
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

function asSeverity(value: unknown): RangeIssue['severity'] {
  if (value === 'minor' || value === 'major') return value
  return undefined
}

function normalizeIssueRange(
  issue: RangeIssue,
  words: AttemptWordAssessment[],
) {
  const wordIndexes = new Set(words.map((word) => word.wordIndex))
  if (wordIndexes.has(issue.startWordIndex)) return issue

  const startWordIndex = issue.startWordIndex - 1
  const endWordIndex = issue.endWordIndex - 1
  if (wordIndexes.has(startWordIndex)) {
    return {
      ...issue,
      startWordIndex,
      endWordIndex,
    }
  }

  return issue
}

export function getEvaluationIssues(
  issues: AttemptEvaluationIssue[] | undefined,
  words: AttemptWordAssessment[],
) {
  if (!Array.isArray(issues)) return []

  return issues.flatMap((item): RangeIssue[] => {
    const startWordIndex = item.startWordIndex
    const endWordIndex = item.endWordIndex
    if (startWordIndex == null || endWordIndex == null) return []

    return [
      normalizeIssueRange(
        {
          startWordIndex,
          endWordIndex,
          suggestion: item.suggestion,
          correction: item.correction,
          feedback: item.reason,
          severity: item.severity,
        },
        words,
      ),
    ]
  })
}

export function getPauseIssues(
  fluencyMetrics: AttemptDetail['fluencyMetrics'],
) {
  const pauses = fluencyMetrics?.pauses ?? fluencyMetrics?.longPauses
  if (!Array.isArray(pauses)) return []

  return pauses.flatMap((item): PauseIssue[] => {
    if (!isRecord(item)) return []

    const afterWordIndex = asNumber(item.afterWordIndex)
    const duration = asNumber(item.duration)
    if (afterWordIndex == null || duration == null || duration < 0.5) {
      return []
    }

    return [
      {
        startTime: asNumber(item.startTime) ?? asNumber(item.startTime),
        endTime: asNumber(item.endTime) ?? asNumber(item.endTime),
        afterWordIndex,
        duration,
      },
    ]
  })
}

export function getIssueForWord(wordIndex: number, issues: RangeIssue[]) {
  return issues.find(
    (item) =>
      wordIndex >= item.startWordIndex && wordIndex <= item.endWordIndex,
  )
}

export function getHighlightedIndexes(
  tab: CriteriaTab,
  words: AttemptWordAssessment[],
  detail: AttemptDetail,
) {
  const indexes = new Set<number>()
  const lexicalIssues = getEvaluationIssues(
    detail.evaluation?.lexical?.issues,
    words,
  )
  const grammarIssues = getEvaluationIssues(
    detail.evaluation?.grammar?.issues,
    words,
  )

  if (tab === 'pronunciation') {
    words.forEach((word) => {
      const hasError = word.errorType && word.errorType !== 'None'
      const hasLowScore = word.accuracyScore != null && word.accuracyScore < 80

      if (hasError || hasLowScore) indexes.add(word.wordIndex)
    })
  }

  if (tab === 'lexical') {
    lexicalIssues.forEach((item) => {
      for (let i = item.startWordIndex; i <= item.endWordIndex; i++) {
        indexes.add(i)
      }
    })
  }

  if (tab === 'grammar') {
    grammarIssues.forEach((item) => {
      for (let i = item.startWordIndex; i <= item.endWordIndex; i++) {
        indexes.add(i)
      }
    })
  }

  return indexes
}

export function buildWordsFromTranscript(transcript?: string) {
  if (!transcript) return []

  return transcript.split(/\s+/).map<AttemptWordAssessment>((token, index) => {
    const match = token.match(/^(.+?)([.,!?;:]*)$/)
    return {
      wordIndex: index,
      word: match?.[1] ?? token,
      punctuationAfter: match?.[2],
    }
  })
}

export function getHighlightClass(
  tab: CriteriaTab,
  word: AttemptWordAssessment,
) {
  if (tab !== 'pronunciation') return HIGHLIGHT_CLASS[tab]

  const hasError = word.errorType && word.errorType !== 'None'
  if (hasError)
    return 'bg-red-100 text-red-800 cursor-pointer hover:brightness-95'
  if (word.accuracyScore != null && word.accuracyScore < 75) {
    return 'bg-red-100 text-red-800 cursor-pointer hover:brightness-95'
  }
  return 'bg-amber-100 text-amber-800 cursor-pointer hover:brightness-95'
}

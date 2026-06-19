export type BandScoreLevel = 'weak' | 'developing' | 'competent' | 'good'
export type BandScoreVariant =
  | 'destructive'
  | 'warning'
  | 'caution'
  | 'success'
  | 'default'

export interface BandScoreMeta {
  level: BandScoreLevel | 'unscored'
  label: string
  variant: BandScoreVariant
}

export function getBandScoreMeta(
  score: number | null | undefined,
): BandScoreMeta {
  if (score == null || score === 0) {
    return { level: 'unscored', label: 'Unscored', variant: 'default' }
  }
  if (score >= 7.0) {
    return { level: 'good', label: 'Good – Excellent', variant: 'success' } // Green
  }
  if (score >= 6.0) {
    return { level: 'competent', label: 'Competent', variant: 'caution' } // Amber/Yellow
  }
  if (score >= 5.0) {
    return { level: 'developing', label: 'Developing', variant: 'warning' } // Orange
  }
  return { level: 'weak', label: 'Weak', variant: 'destructive' } // Red
}

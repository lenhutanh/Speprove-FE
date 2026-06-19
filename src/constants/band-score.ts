import { BandScoreVariant } from '@/lib/band-score'

export const BAND_SCORE_BADGE_VARIANTS: Record<BandScoreVariant, string> = {
  success:
    'border-transparent bg-emerald-100 text-emerald-800 dark:border-transparent dark:bg-emerald-950/30 dark:text-emerald-400',
  caution:
    'border-transparent bg-amber-100 text-amber-800 dark:border-transparent dark:bg-amber-950/30 dark:text-amber-400',
  warning:
    'border-transparent bg-orange-100 text-orange-800 dark:border-transparent dark:bg-orange-950/30 dark:text-orange-400',
  destructive:
    'border-transparent bg-red-100 text-red-800 dark:border-transparent dark:bg-red-950/30 dark:text-red-400',
  default:
    'border-transparent bg-muted text-muted-foreground dark:border-transparent',
}

export const BAND_SCORE_TEXT_VARIANTS: Record<BandScoreVariant, string> = {
  success: 'text-emerald-600 dark:text-emerald-400',
  caution: 'text-amber-600 dark:text-amber-400',
  warning: 'text-orange-600 dark:text-orange-400',
  destructive: 'text-red-600 dark:text-red-400',
  default: 'text-muted-foreground',
}

export const BAND_SCORE_BG_VARIANTS: Record<BandScoreVariant, string> = {
  success: 'bg-emerald-500',
  caution: 'bg-amber-500',
  warning: 'bg-orange-500',
  destructive: 'bg-red-500',
  default: 'bg-muted-foreground',
}

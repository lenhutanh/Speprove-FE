import { cn } from '@/lib/utils'
import { AttemptFluencyMetrics } from '@/types'
import { useTranslations } from 'next-intl'
import { PauseIssue } from './attempt-detail-types'

type MetricTone = 'good' | 'minor' | 'major'

type MetricItem = {
  label: string
  value: string
  status: string
  tone: MetricTone
}

type FluencyLabels = {
  speechRate: string
  longPauses: string
  repetitions: string
  noData: string
  slow: string
  fast: string
  good: string
  smooth: string
  somePauses: string
  manyPauses: string
  lowRepeats: string
  someRepeats: string
  manyRepeats: string
}

function toneClass(tone: MetricTone) {
  return {
    good: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    minor: 'bg-amber-50 text-amber-700 border-amber-100',
    major: 'bg-red-50 text-red-700 border-red-100',
  }[tone]
}

function getSpeechRateMetric(
  labels: FluencyLabels,
  speechRate?: number,
): MetricItem {
  if (speechRate == null) {
    return {
      label: labels.speechRate,
      value: '-',
      status: labels.noData,
      tone: 'minor',
    }
  }

  if (speechRate < 80) {
    return {
      label: labels.speechRate,
      value: `${Math.round(speechRate)} wpm`,
      status: labels.slow,
      tone: 'major',
    }
  }

  if (speechRate > 170) {
    return {
      label: labels.speechRate,
      value: `${Math.round(speechRate)} wpm`,
      status: labels.fast,
      tone: 'minor',
    }
  }

  return {
    label: labels.speechRate,
    value: `${Math.round(speechRate)} wpm`,
    status: labels.good,
    tone: 'good',
  }
}

function getPauseMetric(
  labels: FluencyLabels,
  pauses: PauseIssue[],
): MetricItem {
  const count = pauses.length

  if (count <= 1) {
    return {
      label: labels.longPauses,
      value: String(count),
      status: labels.smooth,
      tone: 'good',
    }
  }

  if (count < 5) {
    return {
      label: labels.longPauses,
      value: String(count),
      status: labels.somePauses,
      tone: 'minor',
    }
  }

  return {
    label: labels.longPauses,
    value: String(count),
    status: labels.manyPauses,
    tone: 'major',
  }
}

function getRepetitionMetric(
  labels: FluencyLabels,
  fluencyMetrics?: AttemptFluencyMetrics,
): MetricItem {
  const repetitionCount =
    typeof fluencyMetrics?.repetitionCount === 'number'
      ? fluencyMetrics.repetitionCount
      : Array.isArray(fluencyMetrics?.repetitions)
        ? fluencyMetrics.repetitions.length
        : undefined

  if (repetitionCount == null) {
    return {
      label: labels.repetitions,
      value: '-',
      status: labels.noData,
      tone: 'minor',
    }
  }

  if (repetitionCount <= 1) {
    return {
      label: labels.repetitions,
      value: String(repetitionCount),
      status: labels.lowRepeats,
      tone: 'good',
    }
  }

  if (repetitionCount < 5) {
    return {
      label: labels.repetitions,
      value: String(repetitionCount),
      status: labels.someRepeats,
      tone: 'minor',
    }
  }

  return {
    label: labels.repetitions,
    value: String(repetitionCount),
    status: labels.manyRepeats,
    tone: 'major',
  }
}

export function AttemptFluencySummary({
  fluencyMetrics,
  pauses,
}: {
  fluencyMetrics?: AttemptFluencyMetrics
  pauses: PauseIssue[]
}) {
  const t = useTranslations('practice.attempt.fluency')
  const labels: FluencyLabels = {
    speechRate: t('speech_rate'),
    longPauses: t('long_pauses'),
    repetitions: t('repetitions'),
    noData: t('no_data'),
    slow: t('slow'),
    fast: t('fast'),
    good: t('good'),
    smooth: t('smooth'),
    somePauses: t('some_pauses'),
    manyPauses: t('many_pauses'),
    lowRepeats: t('low_repeats'),
    someRepeats: t('some_repeats'),
    manyRepeats: t('many_repeats'),
  }
  const items = [
    getSpeechRateMetric(labels, fluencyMetrics?.speechRate),
    getPauseMetric(labels, pauses),
    getRepetitionMetric(labels, fluencyMetrics),
  ]

  return (
    <div className='grid grid-cols-3 gap-3 border-b px-3 py-3'>
      {items.map((item) => (
        <div
          key={item.label}
          className='border-border/60 bg-muted/30 flex flex-col items-center rounded-md border p-2'
        >
          <p className='text-muted-foreground text-xs'>{item.label}</p>
          <p className='text-foreground text-lg font-medium'>{item.value}</p>
          <span
            className={cn(
              'mt-1 inline-flex rounded border px-1.5 py-px text-xs font-medium',
              toneClass(item.tone),
            )}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  )
}

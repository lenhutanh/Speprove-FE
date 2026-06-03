import { cn } from '@/lib/utils'
import { AttemptFluencyMetrics } from '@/types'
import { PauseIssue } from './attempt-detail-types'

type MetricTone = 'good' | 'minor' | 'major'

type MetricItem = {
  label: string
  value: string
  status: string
  tone: MetricTone
}

function toneClass(tone: MetricTone) {
  return {
    good: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    minor: 'bg-amber-50 text-amber-700 border-amber-100',
    major: 'bg-red-50 text-red-700 border-red-100',
  }[tone]
}

function getSpeechRateMetric(speechRate?: number): MetricItem {
  if (speechRate == null) {
    return {
      label: 'Speech rate',
      value: '-',
      status: 'No data',
      tone: 'minor',
    }
  }

  if (speechRate < 80) {
    return {
      label: 'Speech rate',
      value: `${Math.round(speechRate)} wpm`,
      status: 'Slow',
      tone: 'major',
    }
  }

  if (speechRate > 170) {
    return {
      label: 'Speech rate',
      value: `${Math.round(speechRate)} wpm`,
      status: 'Fast',
      tone: 'minor',
    }
  }

  return {
    label: 'Speech rate',
    value: `${Math.round(speechRate)} wpm`,
    status: 'Good',
    tone: 'good',
  }
}

function getPauseMetric(pauses: PauseIssue[]): MetricItem {
  const count = pauses.length

  if (count <= 1) {
    return {
      label: 'Long pauses',
      value: String(count),
      status: 'Smooth',
      tone: 'good',
    }
  }

  if (count < 5) {
    return {
      label: 'Long pauses',
      value: String(count),
      status: 'Some pauses',
      tone: 'minor',
    }
  }

  return {
    label: 'Long pauses',
    value: String(count),
    status: 'Many pauses',
    tone: 'major',
  }
}

function getRepetitionMetric(
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
      label: 'Repetitions',
      value: '-',
      status: 'No data',
      tone: 'minor',
    }
  }

  if (repetitionCount <= 1) {
    return {
      label: 'Repetitions',
      value: String(repetitionCount),
      status: 'Low repeats',
      tone: 'good',
    }
  }

  if (repetitionCount < 5) {
    return {
      label: 'Repetitions',
      value: String(repetitionCount),
      status: 'Some repeats',
      tone: 'minor',
    }
  }

  return {
    label: 'Repetitions',
    value: String(repetitionCount),
    status: 'Many repeats',
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
  const items = [
    getSpeechRateMetric(fluencyMetrics?.speechRate),
    getPauseMetric(pauses),
    getRepetitionMetric(fluencyMetrics),
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
              'mt-1 inline-flex rounded border px-1.5 py-px text-[10px] font-medium',
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

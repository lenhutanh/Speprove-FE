'use client'

import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'

export interface CueCardData {
  prompt: string
  bullets: string[]
}

interface CueCardPanelProps {
  data: CueCardData
}

export function CueCardPanel({ data }: CueCardPanelProps) {
  const t = useTranslations('mock_test.components.cue_card')

  return (
    <div className='flex flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-5 drop-shadow-sm'>
      <span className='w-fit rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 uppercase'>
        {t('title')}
      </span>
      <p className='text-base leading-relaxed font-medium'>{data.prompt}</p>
      <p className='text-sm font-medium italic'>{t('you_should_say')}</p>
      <ul className='mt-1 flex flex-col gap-2'>
        {data.bullets.map((b) => (
          <li key={b} className='flex items-start gap-2 text-sm text-zinc-700'>
            <span className='mt-0.5 text-zinc-400'>•</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface NotePanelProps {
  value: string
  onChange?: (v: string) => void
  mode: 'prep' | 'speaking'
  prepSeconds?: number
}

export function NotePanel({
  value,
  onChange,
  mode,
  prepSeconds = 60,
}: NotePanelProps) {
  const t = useTranslations('mock_test.components.notes')

  return (
    <div className='flex flex-1 flex-col gap-3 overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 drop-shadow-sm'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-zinc-700'>{t('title')}</span>
        {mode === 'prep' ? (
          <span className='rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-semibold text-blue-400'>
            {t('prep_status', { seconds: prepSeconds })}
          </span>
        ) : (
          <span className='rounded-md bg-red-500/20 px-2 py-0.5 text-[11px] font-semibold text-red-400'>
            {t('speaking_status')}
          </span>
        )}
      </div>

      {/* Content */}
      {mode === 'prep' ? (
        <span className='flex flex-1 flex-col'>
          <Textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={t('placeholder')}
            className='flex-1 resize-none rounded-lg bg-zinc-50 p-3 text-sm text-zinc-900 placeholder-zinc-400 focus:ring-1 focus:ring-zinc-300 focus:outline-none'
          />
        </span>
      ) : (
        <div className='flex-1 overflow-y-auto rounded-lg bg-zinc-50 p-3'>
          {value ? (
            <p className='text-sm whitespace-pre-wrap text-zinc-700'>{value}</p>
          ) : (
            <p className='text-sm text-zinc-400 italic'>{t('no_notes')}</p>
          )}
        </div>
      )}

      {/* Prep progress bar */}
      {mode === 'prep' && (
        <div className='h-1 overflow-hidden rounded-full bg-zinc-100'>
          <div
            className='h-full bg-blue-500 transition-all duration-1000'
            style={{ width: `${((60 - prepSeconds) / 60) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

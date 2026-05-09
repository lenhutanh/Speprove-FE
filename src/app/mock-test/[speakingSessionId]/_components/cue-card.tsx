'use client'

import { Textarea } from "@/components/ui/textarea";

export interface CueCardData {
  prompt: string
  bullets: string[]
}

interface CueCardPanelProps {
  data: CueCardData
}

export function CueCardPanel({ data }: CueCardPanelProps) {
  return (
    <div className='flex flex-1 flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 drop-shadow-sm overflow-y-auto'>
      <span className='w-fit rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-amber-800'>
        Cue Card
      </span>
      <p className='text-base font-medium leading-relaxed'>{data.prompt}</p>
      <p className="text-sm font-medium italic">You should say:</p>
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

export function NotePanel({ value, onChange, mode, prepSeconds = 60 }: NotePanelProps) {
  return (
    <div className='flex flex-1 flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 drop-shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-zinc-700'>Ghi chú của bạn</span>
        {mode === 'prep' ? (
          <span className='rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-semibold text-blue-400'>
            Chuẩn bị · {prepSeconds}s
          </span>
        ) : (
          <span className='rounded-md bg-red-500/20 px-2 py-0.5 text-[11px] font-semibold text-red-400'>
            Đang nói
          </span>
        )}
      </div>

      {/* Content */}
      {mode === 'prep' ? (
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder='Ghi chú nhanh...'
          className='flex-1 resize-none rounded-lg bg-zinc-50 p-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300'
        />
      ) : (
        <div className='flex-1 rounded-lg bg-zinc-50 p-3 overflow-y-auto'>
          {value ? (
            <p className='whitespace-pre-wrap text-sm text-zinc-700'>{value}</p>
          ) : (
            <p className='text-sm italic text-zinc-400'>Không có ghi chú</p>
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
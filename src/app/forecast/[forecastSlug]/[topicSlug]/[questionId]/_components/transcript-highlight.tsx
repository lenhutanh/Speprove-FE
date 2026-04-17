'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { cn } from '@/lib/utils'
import {
  Evaluation,
  GrammarError,
  LexicalWeakWord,
  LongPause,
  SpeechMetrics,
  Word,
} from '@/types'
import * as RadixPopover from '@radix-ui/react-popover'

// ─── helpers ────────────────────────────────────────────────────────────────

function phChipClass(score: number) {
  if (score < 50) return 'bg-red-50 border-red-200 text-red-700'
  if (score < 80) return 'bg-amber-50 border-amber-200 text-amber-700'
  return 'bg-muted border-border text-muted-foreground'
}

function scorePillClass(score: number) {
  if (score < 75) return 'bg-red-50 text-red-700'
  if (score < 85) return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

// ─── Popover content per criteria ───────────────────────────────────────────

/**
 * PRONUNCIATION
 * Shows spoken IPA, per-phoneme score chips, tip for weak sounds
 */
function PronunciationContent({
  word,
  audioUrl,
}: {
  word: Word
  audioUrl: string
}) {
  return (
    <div className='space-y-2.5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-1.5'>
          <span className='text-foreground text-sm font-medium'>
            {word.word}
          </span>
          <span className='text-muted-foreground font-mono text-[10px]'>
            /{word.spokenIpa}/
          </span>
          <AudioPlayer
            url={audioUrl}
            variant='minimal'
            iconVariant='volume'
            startTime={word.offset}
            endTime={word.offset + word.duration}
          />
        </div>
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
            scorePillClass(word.score),
          )}
        >
          {word.score}
        </span>
      </div>

      <div className='flex flex-wrap gap-1'>
        {word.phonemes.map((ph, i) => (
          <div
            key={i}
            className={cn(
              'flex min-w-[28px] flex-col items-center rounded border px-1.5 py-1',
              phChipClass(ph.score),
            )}
          >
            <span className='font-mono text-[11px] leading-none font-medium'>
              {ph.sound}
            </span>
            <span className='mt-0.5 text-[10px] opacity-80'>{ph.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * FLUENCY
 * Shows pause duration + actionable tip
 */
function FluencyContent({ word, pause }: { word: Word; pause: LongPause }) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground text-sm font-medium'>Long pause</span>
        <span className='rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700'>
          {pause.duration.toFixed(2)}s
        </span>
      </div>
      <p className='text-muted-foreground text-[11px] leading-relaxed'>
        Khoảng dừng sau{' '}
        <span className='text-foreground font-medium'>
          &quot;{word.word}&quot;
        </span>
        . Nên dưới 0.4s — thử dùng filler tự nhiên hoặc liên từ để nối mượt hơn.
      </p>
    </div>
  )
}

/**
 * LEXICAL
 * Shows original → suggestion with reason
 */
function LexicalContent({ item }: { item: LexicalWeakWord }) {
  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-foreground text-sm font-medium'>
          {item.original}
        </span>
        <span className='text-muted-foreground/40 text-xs'>→</span>
        <span className='text-sm font-medium text-emerald-700'>
          {item.suggestion}
        </span>
      </div>
      <div className='border-border border-t pt-2'>
        <p className='text-muted-foreground text-[11px] leading-relaxed'>
          {item.reason}
        </p>
      </div>
    </div>
  )
}

/**
 * GRAMMAR
 * Shows strikethrough error → correction + explanation
 */
function GrammarContent({ error }: { error: GrammarError }) {
  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap items-center gap-2'>
        <span className='text-sm font-medium text-red-700 line-through decoration-red-400'>
          {error.original}
        </span>
        <span className='text-muted-foreground/40 text-xs'>→</span>
        <span className='text-sm font-medium text-emerald-700'>
          {error.correction}
        </span>
      </div>
      <div className='border-border border-t pt-2'>
        <p className='text-muted-foreground text-[11px] leading-relaxed'>
          {error.reason}
        </p>
      </div>
    </div>
  )
}

// ─── WordToken ───────────────────────────────────────────────────────────────

type HighlightType =
  | 'pronunciation-low'
  | 'pronunciation-mid'
  | 'pause'
  | 'lexical'
  | 'grammar'

const HL_CLASS: Record<HighlightType, string> = {
  'pronunciation-low':
    'bg-red-100 text-red-800 cursor-pointer rounded-[3px] hover:brightness-95',
  'pronunciation-mid':
    'bg-amber-100 text-amber-800 cursor-pointer rounded-[3px] hover:brightness-95',
  pause:
    'bg-amber-100 text-amber-800 cursor-pointer rounded-[3px] hover:brightness-95',
  lexical:
    'bg-amber-100 text-amber-800 cursor-pointer rounded-[3px] hover:brightness-95',
  grammar:
    'bg-red-100 text-red-800 underline decoration-wavy decoration-red-400 cursor-pointer rounded-[3px] hover:brightness-95',
}

interface WordTokenProps {
  word: Word
  highlight?: HighlightType
  popoverContent?: React.ReactNode
}

function WordToken({ word, highlight, popoverContent }: WordTokenProps) {
  const inner = (
    <>
      <span className={cn('px-0.5 py-px', highlight && HL_CLASS[highlight])}>
        {word.word}
      </span>
      {word.punctuationAfter && (
        <span className='text-foreground'>{word.punctuationAfter}</span>
      )}
    </>
  )

  if (!highlight || !popoverContent) {
    return <span>{inner} </span>
  }

  return (
    <>
      <RadixPopover.Root>
        <RadixPopover.Trigger asChild>
          <span className='inline cursor-pointer'>{inner}</span>
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content
            side='bottom'
            align='start'
            sideOffset={6}
            avoidCollisions
            className={cn(
              'border-border/60 bg-background z-50 w-[230px] rounded-lg border p-3 shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
          >
            {popoverContent}
            <RadixPopover.Arrow className='fill-border/60' />
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>{' '}
    </>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

type CriteriaTab = 'fluency' | 'pronunciation' | 'lexical' | 'grammar'

interface TranscriptHighlightProps {
  tab: CriteriaTab
  evaluation: Evaluation
  speechMetrics: SpeechMetrics
  audioUrl: string
}

export function TranscriptHighlight({
  tab,
  evaluation,
  speechMetrics,
  audioUrl,
}: TranscriptHighlightProps) {
  const words = speechMetrics.words

  const highlightMap = new Map<number, HighlightType>()
  const popoverMap = new Map<number, React.ReactNode>()

  if (tab === 'pronunciation') {
    words.forEach((w) => {
      if (!w.isScoreable) return
      if (w.score < 75) {
        highlightMap.set(w.wordIndex, 'pronunciation-low')
        popoverMap.set(
          w.wordIndex,
          <PronunciationContent word={w} audioUrl={audioUrl} />,
        )
      } else if (w.score < 85) {
        highlightMap.set(w.wordIndex, 'pronunciation-mid')
        popoverMap.set(
          w.wordIndex,
          <PronunciationContent word={w} audioUrl={audioUrl} />,
        )
      }
    })
  }

  if (tab === 'fluency') {
    speechMetrics.longPauses.forEach((pause) => {
      const word = words.find((w) => w.wordIndex === pause.afterWordIndex)
      if (!word) return
      highlightMap.set(pause.afterWordIndex, 'pause')
      popoverMap.set(
        pause.afterWordIndex,
        <FluencyContent word={word} pause={pause} />,
      )
    })
  }

  if (tab === 'lexical' && evaluation.lexical?.weakWords) {
    evaluation.lexical.weakWords.forEach((item) => {
      for (let i = item.startWordIndex; i <= item.endWordIndex; i++) {
        highlightMap.set(i, 'lexical')
      }
      popoverMap.set(item.endWordIndex, <LexicalContent item={item} />)
    })
  }

  if (tab === 'grammar' && evaluation.grammar?.errors) {
    evaluation.grammar.errors.forEach((error) => {
      for (let i = error.startWordIndex; i <= error.endWordIndex; i++) {
        highlightMap.set(i, 'grammar')
      }
      popoverMap.set(error.endWordIndex, <GrammarContent error={error} />)
    })
  }

  const legend: { color: string; label: string }[] = {
    fluency: [{ color: 'bg-amber-100', label: 'Long pause' }],
    pronunciation: [
      { color: 'bg-red-100', label: 'Score < 75' },
      { color: 'bg-amber-100', label: 'Score 75–85' },
    ],
    lexical: [{ color: 'bg-amber-100', label: 'Weak word' }],
    grammar: [{ color: 'bg-red-100', label: 'Grammar error' }],
  }[tab]

  return (
    <div>
      {/* legend */}
      <div className='mb-2 flex flex-wrap gap-3'>
        {legend.map((l) => (
          <div key={l.label} className='flex items-center gap-1.5'>
            <span
              className={cn('h-2 w-2 flex-shrink-0 rounded-[2px]', l.color)}
            />
            <span className='text-muted-foreground text-[10px]'>{l.label}</span>
          </div>
        ))}
      </div>

      {/* transcript */}
      <div className='text-foreground text-sm leading-[2.5]'>
        {words.map((word) => (
          <WordToken
            key={word.wordIndex}
            word={word}
            highlight={highlightMap.get(word.wordIndex)}
            popoverContent={popoverMap.get(word.wordIndex)}
          />
        ))}
      </div>
    </div>
  )
}

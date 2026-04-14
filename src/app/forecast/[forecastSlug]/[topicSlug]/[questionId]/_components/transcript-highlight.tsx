'use client'

import * as RadixPopover from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import {
  Word,
  LongPause,
  LexicalWeakWord,
  GrammarError,
  Evaluation,
  SpeechMetrics,
} from '@/types'
import { AudioPlayer } from '@/components/ui/audio-player'

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
function PronunciationContent({ word, audioUrl }: { word: Word, audioUrl: string }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-medium text-foreground">{word.word}</span>
          <span className="text-[10px] text-muted-foreground font-mono">/{word.spokenIpa}/</span>
          <AudioPlayer
            url={audioUrl}
            variant="minimal"
            iconVariant="volume"
            startTime={word.offset}
            endTime={word.offset + word.duration}
          />
        </div>
        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', scorePillClass(word.score))}>
          {word.score}
        </span>
      </div>

      <div className="flex gap-1 flex-wrap">
        {word.phonemes.map((ph, i) => (
          <div key={i} className={cn('flex flex-col items-center px-1.5 py-1 rounded border min-w-[28px]', phChipClass(ph.score))}>
            <span className="text-[11px] font-medium font-mono leading-none">{ph.sound}</span>
            <span className="text-[10px] mt-0.5 opacity-80">{ph.score}</span>
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Long pause</span>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
          {pause.duration.toFixed(2)}s
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Khoảng dừng sau{' '}
        <span className="font-medium text-foreground">"{word.word}"</span>.{' '}
        Nên dưới 0.4s — thử dùng filler tự nhiên hoặc liên từ để nối mượt hơn.
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
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-foreground">{item.original}</span>
        <span className="text-muted-foreground/40 text-xs">→</span>
        <span className="text-sm font-medium text-emerald-700">{item.suggestion}</span>
      </div>
      <div className="border-t border-border pt-2">
        <p className="text-[11px] text-muted-foreground leading-relaxed">{item.reason}</p>
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
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-red-700 line-through decoration-red-400">
          {error.original}
        </span>
        <span className="text-muted-foreground/40 text-xs">→</span>
        <span className="text-sm font-medium text-emerald-700">{error.correction}</span>
      </div>
      <div className="border-t border-border pt-2">
        <p className="text-[11px] text-muted-foreground leading-relaxed">{error.reason}</p>
      </div>
    </div>
  )
}

// ─── WordToken ───────────────────────────────────────────────────────────────

type HighlightType = 'pronunciation-low' | 'pronunciation-mid' | 'pause' | 'lexical' | 'grammar'

const HL_CLASS: Record<HighlightType, string> = {
  'pronunciation-low': 'bg-red-100 text-red-800 cursor-pointer rounded-[3px] hover:brightness-95',
  'pronunciation-mid': 'bg-amber-100 text-amber-800 cursor-pointer rounded-[3px] hover:brightness-95',
  'pause': 'bg-amber-100 text-amber-800 cursor-pointer rounded-[3px] hover:brightness-95',
  'lexical': 'bg-amber-100 text-amber-800 cursor-pointer rounded-[3px] hover:brightness-95',
  'grammar': 'bg-red-100 text-red-800 underline decoration-wavy decoration-red-400 cursor-pointer rounded-[3px] hover:brightness-95',
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
        <span className="text-foreground">{word.punctuationAfter}</span>
      )}
    </>
  )

  if (!highlight || !popoverContent) {
    return <span>{inner}{' '}</span>
  }

  return (
    <>
      <RadixPopover.Root>
        <RadixPopover.Trigger asChild>
          <span className="inline cursor-pointer">{inner}</span>
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content
            side="bottom"
            align="start"
            sideOffset={6}
            avoidCollisions
            className={cn(
              'z-50 w-[230px] rounded-lg border border-border/60 bg-background p-3 shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            )}
          >
            {popoverContent}
            <RadixPopover.Arrow className="fill-border/60" />
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
      {' '}
    </>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

type CriteriaTab = 'fluency' | 'pronunciation' | 'lexical' | 'grammar'

interface TranscriptHighlightProps {
  tab: CriteriaTab
  evaluation: Evaluation
  speechMetrics: SpeechMetrics,
  audioUrl: string
}

export function TranscriptHighlight({ tab, evaluation, speechMetrics, audioUrl }: TranscriptHighlightProps) {
  const words = speechMetrics.words

  const highlightMap = new Map<number, HighlightType>()
  const popoverMap = new Map<number, React.ReactNode>()

  if (tab === 'pronunciation') {
    words.forEach((w) => {
      if (!w.isScoreable) return
      if (w.score < 75) {
        highlightMap.set(w.wordIndex, 'pronunciation-low')
        popoverMap.set(w.wordIndex, <PronunciationContent word={w} audioUrl={audioUrl} />)
      } else if (w.score < 85) {
        highlightMap.set(w.wordIndex, 'pronunciation-mid')
        popoverMap.set(w.wordIndex, <PronunciationContent word={w} audioUrl={audioUrl} />)
      }
    })
  }

  if (tab === 'fluency') {
    speechMetrics.longPauses.forEach((pause) => {
      const word = words.find((w) => w.wordIndex === pause.afterWordIndex)
      if (!word) return
      highlightMap.set(pause.afterWordIndex, 'pause')
      popoverMap.set(pause.afterWordIndex, <FluencyContent word={word} pause={pause} />)
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
      <div className="flex gap-3 flex-wrap mb-2">
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-[2px] flex-shrink-0', l.color)} />
            <span className="text-[10px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>

      {/* transcript */}
      <div className="leading-[2.5] text-sm text-foreground">
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
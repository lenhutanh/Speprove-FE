'use client'

import { useState } from 'react'
import { Play, Trophy, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLeaderboardQuery } from '@/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface PracticeLeaderboardProps {
  questionId: string
}

// Màu avatar xoay vòng theo index
const AVATAR_STYLES = [
  'bg-indigo-50 text-indigo-600',
  'bg-emerald-50 text-emerald-700',
  'bg-amber-50 text-amber-700',
  'bg-pink-50 text-pink-700',
  'bg-cyan-50 text-cyan-700',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function bandColor(band: number) {
  if (band >= 7) return 'text-emerald-600'
  if (band >= 6) return 'text-amber-600'
  return 'text-slate-500'
}

function bandBg(band: number) {
  if (band >= 7) return 'bg-emerald-50 text-emerald-700'
  if (band >= 6) return 'bg-amber-50 text-amber-700'
  return 'bg-muted text-muted-foreground'
}

export default function PracticeLeaderboard({ questionId }: PracticeLeaderboardProps) {
  // const { data, isLoading } = useLeaderboardQuery(questionId)
  // const entries = data?.data ?? []

  // --- Mock data để dev ---
  const isLoading = false
  const entries = [
    {
      _id: '1',
      user: { name: 'Trần Hương', avatarUrl: null },
      band: 7.5,
      duration: 72,
      audioUrl: '/audio/1.mp3',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      transcript: 'I would love to live in a modern apartment with an open-plan living space...',
    },
    {
      _id: '2',
      user: { name: 'Minh Khoa', avatarUrl: null },
      band: 7.0,
      duration: 58,
      audioUrl: '/audio/2.mp3',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      transcript: 'The house I dream of has panoramic views overlooking the city...',
    },
    {
      _id: '3',
      user: { name: 'Ngọc Anh', avatarUrl: null },
      band: 6.5,
      duration: 65,
      audioUrl: '/audio/3.mp3',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      transcript: 'In the near future I hope to own a spacious house near the park...',
    },
  ]
  // --- End mock ---

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 flex-shrink-0">
        <Trophy className="w-3.5 h-3.5 text-amber-500" />
        <p className="text-[11px] font-medium text-muted-foreground">
          Bài nói hay nhất từ cộng đồng
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}

        {!isLoading && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
            <Trophy className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chưa có bài nào được chia sẻ.
              <br />
              Hãy là người đầu tiên!
            </p>
          </div>
        )}

        {!isLoading &&
          entries.map((entry, index) => (
            <LeaderboardItem
              key={entry._id}
              entry={entry}
              rank={index + 1}
              avatarStyle={AVATAR_STYLES[index % AVATAR_STYLES.length]}
            />
          ))}
      </div>
    </div>
  )
}

function LeaderboardItem({
  entry,
  rank,
  avatarStyle,
}: {
  entry: any
  rank: number
  avatarStyle: string
}) {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)

  const timeAgo = formatDistanceToNow(new Date(entry.createdAt), {
    addSuffix: true,
    locale: vi,
  })
  const duration = `${Math.floor(entry.duration / 60)}:${String(entry.duration % 60).padStart(2, '0')}`

  return (
    <div
      className={cn(
        'border border-border/60 rounded-lg overflow-hidden transition-colors',
        open && 'border-border'
      )}
    >
      {/* Row header */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* Rank */}
        <span
          className={cn(
            'text-[11px] font-semibold w-5 text-center flex-shrink-0',
            rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : 'text-muted-foreground/50'
          )}
        >
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank}
        </span>

        {/* Avatar */}
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0',
            avatarStyle
          )}
        >
          {getInitials(entry.user.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-800 truncate">{entry.user.name}</p>
          <p className="text-[10px] text-muted-foreground">
            {timeAgo} · {duration}
          </p>
        </div>

        {/* Band */}
        <span
          className={cn(
            'text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0',
            bandBg(entry.band)
          )}
        >
          {entry.band}
        </span>

        {/* Play + expand */}
        <button
          onClick={() => setPlaying((v) => !v)}
          className="w-7 h-7 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <Play className="w-3 h-3 text-indigo-600 ml-0.5" />
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-muted-foreground flex-shrink-0"
        >
          {open ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expanded transcript */}
      {open && (
        <div className="px-4 pb-3 border-t border-border bg-muted/30">
          {/* Waveform mockup */}
          <div className="flex items-center gap-2 py-2.5 border-b border-border mb-2">
            <button
              onClick={() => setPlaying((v) => !v)}
              className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0"
            >
              <Play className="w-2.5 h-2.5 text-indigo-600 ml-0.5" />
            </button>
            <div className="flex-1 h-1 bg-border rounded-full">
              <div className="w-[30%] h-full bg-indigo-400 rounded-full" />
            </div>
            <span className="text-[10px] text-muted-foreground">{duration}</span>
          </div>

          {/* Transcript */}
          <p className="text-[11px] text-muted-foreground leading-relaxed italic">
            "{entry.transcript}"
          </p>
        </div>
      )}
    </div>
  )
}

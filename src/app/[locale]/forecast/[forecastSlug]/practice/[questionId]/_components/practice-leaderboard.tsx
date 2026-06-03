'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useLeaderboardQuery } from '@/queries'
import { AttemptLeaderBoardType } from '@/types'
import { getInitials } from '@/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronDown, ChevronRight, Trophy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface PracticeLeaderboardProps {
  questionId: string
}

function bandBg(band: number) {
  if (band >= 7) return 'bg-emerald-50 text-emerald-700'
  if (band >= 6) return 'bg-amber-50 text-amber-700'
  return 'bg-muted text-muted-foreground'
}

export default function PracticeLeaderboard({
  questionId,
}: PracticeLeaderboardProps) {
  const t = useTranslations('practice.leaderboard')
  const [band, setBand] = useState<6 | 7 | 8>(6)
  const { data, isLoading } = useLeaderboardQuery({
    enabled: !!questionId,
    params: { forecastQuestionId: questionId, band },
  })
  const entries = data?.data ?? []

  return (
    <div className='flex h-full flex-col overflow-hidden'>
      <Tabs
        value={String(band)}
        onValueChange={(v) => setBand(Number(v) as 6 | 7 | 8)}
        className='px-3 pt-3'
      >
        <TabsList className='w-full'>
          <TabsTrigger value='6'>Band 6</TabsTrigger>
          <TabsTrigger value='7'>Band 7</TabsTrigger>
          <TabsTrigger value='8'>Band 8</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='flex-1 space-y-2 overflow-y-auto p-3'>
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-16 rounded-lg' />
          ))}

        {!isLoading && entries.length === 0 && (
          <div className='flex h-full flex-col items-center justify-center gap-2 px-4 text-center'>
            <Trophy className='text-muted-foreground/30 h-8 w-8' />
            <p className='text-muted-foreground text-xs leading-relaxed'>
              {t('empty')}
              <br />
              {t('empty_hint')}
            </p>
          </div>
        )}

        {!isLoading &&
          entries.map((entry, index) => (
            <LeaderboardItem key={entry.id} entry={entry} rank={index + 1} />
          ))}
      </div>
    </div>
  )
}

function LeaderboardItem({
  entry,
  rank,
}: {
  entry: AttemptLeaderBoardType
  rank: number
}) {
  const [open, setOpen] = useState(false)

  const timeAgo = formatDistanceToNow(new Date(entry.createdAt), {
    addSuffix: true,
    locale: vi,
  })

  return (
    <div
      className={cn(
        'border-border/60 overflow-hidden rounded-lg border transition-colors',
        open && 'border-border',
      )}
    >
      <div className='flex items-center gap-3 px-3 py-2.5'>
        <span
          className={cn(
            'w-5 flex-shrink-0 text-center text-[11px] font-semibold',
            rank === 1
              ? 'text-amber-500'
              : rank === 2
                ? 'text-slate-400'
                : 'text-muted-foreground/50',
          )}
        >
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank}
        </span>

        <Avatar>
          <AvatarImage src={entry.user.avatar} alt={entry.user.fullName} />
          <AvatarFallback className='text-xs font-semibold'>
            {getInitials(entry.user.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className='min-w-0 flex-1'>
          <p className='truncate text-xs font-medium text-slate-800'>
            {entry.user.fullName}
          </p>
          <p className='text-muted-foreground text-[10px]'>{timeAgo}</p>
        </div>

        <span
          className={cn(
            'flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold',
            bandBg(entry.band),
          )}
        >
          {entry.scores.overall}
        </span>

        <button
          onClick={() => setOpen((v) => !v)}
          className='text-muted-foreground flex-shrink-0'
        >
          {open ? (
            <ChevronDown className='h-3.5 w-3.5' />
          ) : (
            <ChevronRight className='h-3.5 w-3.5' />
          )}
        </button>
      </div>

      {open && (
        <div className='border-border bg-muted/30 border-t px-4 pb-3'>
          <div className='border-border mb-2 border-b py-2'>
            <AudioPlayer url={entry.audioUrl} variant='full' />
          </div>

          <p className='text-muted-foreground text-[11px] leading-relaxed italic'>
            &quot;{entry.transcript}&quot;
          </p>
        </div>
      )}
    </div>
  )
}

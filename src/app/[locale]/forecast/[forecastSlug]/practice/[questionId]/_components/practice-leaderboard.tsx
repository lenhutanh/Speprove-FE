'use client'

import { AudioPlayer } from '@/components/ui/audio-player'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BAND_SCORE_BADGE_VARIANTS } from '@/constants'
import { cn, getBandScoreMeta } from '@/lib'
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

const SCORE_BADGES = [
  { key: 'fluency', labelKey: 'fluency' },
  { key: 'pronunciation', labelKey: 'pronunciation' },
  { key: 'lexical', labelKey: 'lexical' },
  { key: 'grammar', labelKey: 'grammar' },
] as const

export default function PracticeLeaderboard({
  questionId,
}: PracticeLeaderboardProps) {
  const t = useTranslations('practice.leaderboard')
  const [band, setBand] = useState<6 | 7 | 8>(6)
  const [openAttemptId, setOpenAttemptId] = useState<string | null>(null)
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
          <TabsTrigger value='6'>{t('band_label', { band: '6' })}</TabsTrigger>
          <TabsTrigger value='7'>{t('band_label', { band: '7' })}</TabsTrigger>
          <TabsTrigger value='8'>{t('band_label', { band: '8' })}</TabsTrigger>
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
            <LeaderboardItem
              key={entry.id}
              entry={entry}
              rank={index + 1}
              open={openAttemptId === entry.id}
              onOpenChange={(open) => setOpenAttemptId(open ? entry.id : null)}
            />
          ))}
      </div>
    </div>
  )
}

function LeaderboardItem({
  entry,
  rank,
  open,
  onOpenChange,
}: {
  entry: AttemptLeaderBoardType
  rank: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const tCriteria = useTranslations('practice.attempt.criteria')
  const timeAgo = formatDistanceToNow(new Date(entry.createdAt), {
    addSuffix: true,
    locale: vi,
  })
  const overall = entry.scores.overall
  const bandScoreMeta = getBandScoreMeta(overall)

  return (
    <div
      className={cn(
        'border-border/60 overflow-hidden rounded-lg border transition-colors',
        open ? 'border-foreground/40' : 'border-border/60',
      )}
    >
      <div className='flex items-center gap-3 px-3 py-2.5'>
        <span
          className={cn(
            'w-5 flex-shrink-0 text-center text-xs font-semibold',
            rank === 1
              ? 'text-amber-500'
              : rank === 2
                ? 'text-slate-400'
                : 'text-muted-foreground/50',
          )}
        >
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank}
        </span>

        <Avatar className='size-10 border'>
          <AvatarImage src={entry.user.avatar} alt={entry.user.fullName} />
          <AvatarFallback className='text-sm font-semibold'>
            {getInitials(entry.user.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className='min-w-0 flex-1'>
          <p className='text-foreground truncate text-sm font-medium'>
            {entry.user.fullName}
          </p>
          <p className='text-muted-foreground text-xs'>{timeAgo}</p>
        </div>

        <Badge
          variant='outline'
          className={cn(
            'flex-shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold whitespace-nowrap',
            BAND_SCORE_BADGE_VARIANTS[bandScoreMeta.variant],
          )}
        >
          Band {overall ? overall.toFixed(1) : '—'}
        </Badge>

        <button
          onClick={() => onOpenChange(!open)}
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
        <div className='border-border bg-muted/30 border-t'>
          <div className='border-border border-b px-4 py-2'>
            <AudioPlayer url={entry.audioUrl} variant='full' />
          </div>

          <div className='flex flex-wrap gap-3 border-b px-4 py-2'>
            {SCORE_BADGES.map(({ key, labelKey }) => {
              const score = entry.scores[key]
              if (score == null) return null
              const meta = getBandScoreMeta(score)

              return (
                <Badge
                  key={key}
                  variant='outline'
                  className={cn(
                    'rounded-full px-3 py-0.5 text-sm font-medium',
                    BAND_SCORE_BADGE_VARIANTS[meta.variant],
                  )}
                >
                  {tCriteria(labelKey)} {score}
                </Badge>
              )
            })}
          </div>

          <p className='px-4 py-2 text-sm leading-relaxed italic'>
            &quot;{entry.transcript}&quot;
          </p>
        </div>
      )}
    </div>
  )
}

'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
import { BAND_SCORE_BADGE_VARIANTS } from '@/constants'
import { cn, getBandScoreMeta } from '@/lib'
import { useAttemptQuery, useToggleShareMutation } from '@/queries'
import { AttemptListItem } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  Lock,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { AttemptDetailTabs } from './attempt-detail-tabs'

interface HistoryItemProps {
  history: AttemptListItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getAttemptStatusMeta(status: number) {
  switch (status) {
    case 0:
      return {
        labelKey: 'status_preparing',
        dot: 'bg-muted-foreground',
        pill: 'bg-muted text-muted-foreground',
      } as const
    case 1:
      return {
        labelKey: 'status_processing',
        dot: 'bg-indigo-400',
        pill: 'bg-indigo-50 text-indigo-700',
      } as const
    case 2:
      return {
        labelKey: 'status_completed',
        dot: 'bg-emerald-500',
        pill: 'bg-emerald-50 text-emerald-700',
      } as const
    case 3:
      return {
        labelKey: 'status_failed',
        dot: 'bg-red-500',
        pill: 'bg-red-50 text-red-700',
      } as const
    default:
      return {
        labelKey: 'status_processing',
        dot: 'bg-muted-foreground',
        pill: 'bg-muted text-muted-foreground',
      } as const
  }
}

export default function HistoryItem({
  history,
  open,
  onOpenChange,
}: HistoryItemProps) {
  const t = useTranslations('practice.history')
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const toggleShareMutation = useToggleShareMutation()
  const queryClient = useQueryClient()
  const status = history.status
  const isCompleted = status === 2
  const isFailed = status === 3
  const statusMeta = getAttemptStatusMeta(status)
  const { data: detailRes, isLoading: isDetailLoading } = useAttemptQuery(
    history.id,
    {
      enabled: open && isCompleted,
    },
  )

  const detail = detailRes?.data
  const scores = detail?.scores ?? history.scores
  const { audioUrl, createdAt } = history
  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: vi,
  })

  const overall = scores?.overall
  const bandScoreMeta = getBandScoreMeta(overall)

  const onToggleShare = () => {
    toggleShareMutation.mutate(
      { id: history.id, isPublic: !history.isPublic },
      {
        onSuccess: (res) => {
          if (res.success) {
            queryClient.invalidateQueries({
              queryKey: [
                'attempt-list',
                { forecastQuestionId: history.forecastQuestionId },
              ],
            })
          }
        },
      },
    )
  }

  return (
    <>
      <div
        className={cn(
          'overflow-hidden rounded-lg border',
          open ? 'border-foreground/40' : 'border-border/60',
        )}
      >
        <button
          onClick={() => onOpenChange(!open)}
          className={cn(
            'hover:bg-muted/40 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 transition-colors sm:grid sm:grid-cols-[150px_120px_1fr_100px_24px] sm:gap-3',
            open ? 'bg-muted/40' : 'bg-background',
          )}
          style={{ borderRadius: open ? '8px 8px 0 0' : undefined }}
        >
          <span className='text-muted-foreground truncate text-left text-sm'>
            {timeAgo}
          </span>

          <div className='flex justify-start'>
            {isCompleted && overall != null ? (
              <Badge
                variant='outline'
                className={cn(
                  'rounded-md px-2 py-0.5 text-sm font-bold whitespace-nowrap',
                  BAND_SCORE_BADGE_VARIANTS[bandScoreMeta.variant],
                )}
              >
                Band {overall.toFixed(1)}
              </Badge>
            ) : (
              <Badge
                variant='outline'
                className={cn(
                  'gap-1 rounded-md px-2 py-0.5 text-sm font-normal whitespace-nowrap',
                  status === 3
                    ? 'border-destructive text-destructive'
                    : 'border-border text-muted-foreground bg-transparent',
                )}
              >
                {status === 0 && <Clock className='size-3.5' />}
                {status === 1 && <Loader2 className='size-3.5 animate-spin' />}
                {status === 3 && <AlertCircle className='size-3.5' />}
                {t(statusMeta.labelKey)}
              </Badge>
            )}
          </div>

          <div className='hidden sm:block' />

          <div className='flex justify-end'>
            {isCompleted && (
              <Badge
                variant={history.isPublic ? 'default' : 'secondary'}
                className='cursor-pointer gap-1 px-2 sm:px-2.5'
                onClick={(e) => {
                  e.stopPropagation()
                  setShareDialogOpen(true)
                }}
              >
                {history.isPublic ? (
                  <Globe className='h-3 w-3' />
                ) : (
                  <Lock className='h-3 w-3' />
                )}
                <span className='hidden sm:inline'>
                  {history.isPublic ? t('public') : t('private')}
                </span>
              </Badge>
            )}
          </div>

          <div className='flex justify-end'>
            {open ? (
              <ChevronDown className='text-muted-foreground h-3.5 w-3.5' />
            ) : (
              <ChevronRight className='text-muted-foreground h-3.5 w-3.5' />
            )}
          </div>
        </button>

        {open && (
          <div className='border-border border-t'>
            {audioUrl && (
              <div className='border-border bg-muted/20 p-4'>
                <AudioPlayer url={audioUrl} variant='full' />
              </div>
            )}

            {!isCompleted && (
              <div
                className={cn(
                  'px-3 py-3 text-sm',
                  isFailed ? 'text-red-700' : 'text-muted-foreground',
                )}
              >
                {t(statusMeta.labelKey)}
              </div>
            )}

            {isCompleted && isDetailLoading && (
              <div className='text-muted-foreground px-3 py-3 text-sm'>
                {t('loading_analysis')}
              </div>
            )}

            {isCompleted && !isDetailLoading && (
              <>
                {detail && <AttemptDetailTabs detail={detail} />}
                {!detail && (
                  <div className='text-muted-foreground px-3 py-3 text-sm'>
                    {t('empty_detail')}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {history.isPublic
                ? t('make_private_title')
                : t('make_public_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {history.isPublic
                ? t('make_private_desc')
                : t('make_public_desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onToggleShare}
              disabled={toggleShareMutation.isPending}
            >
              {t('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

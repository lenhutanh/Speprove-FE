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
import { cn } from '@/lib/utils'
import { useAttemptQuery, useToggleShareMutation } from '@/queries'
import { AttemptListItem } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronDown, ChevronRight, Globe, Lock } from 'lucide-react'
import { useState } from 'react'
import { AttemptDetailTabs } from './attempt-detail-tabs'

interface HistoryItemProps {
  history: AttemptListItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HistoryItem({
  history,
  open,
  onOpenChange,
}: HistoryItemProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const toggleShareMutation = useToggleShareMutation()
  const queryClient = useQueryClient()
  const { data: detailRes, isLoading: isDetailLoading } = useAttemptQuery(
    history.id,
    {
      enabled: open,
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
  const overallColor =
    overall != null && overall >= 7
      ? { dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700' }
      : overall != null && overall >= 6
        ? { dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700' }
        : { dot: 'bg-muted-foreground', pill: 'bg-muted text-muted-foreground' }

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
            'hover:bg-muted/40 flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors',
            open ? 'bg-muted/40' : 'bg-background',
          )}
          style={{ borderRadius: open ? '8px 8px 0 0' : undefined }}
        >
          <div className='flex items-center gap-2'>
            <div
              className={cn(
                'h-2 w-2 flex-shrink-0 rounded-full',
                overallColor.dot,
              )}
            />
            <span className='text-muted-foreground text-sm'>{timeAgo}</span>
            {overall != null && (
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-sm font-medium',
                  overallColor.pill,
                )}
              >
                Band {overall}
              </span>
            )}
          </div>

          <div className='flex items-center gap-4'>
            <Badge
              variant={history.isPublic ? 'default' : 'secondary'}
              className='cursor-pointer gap-1 rounded-full'
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
              {history.isPublic ? 'Public' : 'Private'}
            </Badge>
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
              <div className='border-border bg-muted/20 border-b px-3 py-2'>
                <AudioPlayer url={audioUrl} variant='full' />
              </div>
            )}

            {isDetailLoading && (
              <div className='text-muted-foreground px-3 py-3 text-sm'>
                Loading analysis...
              </div>
            )}

            {!isDetailLoading && (
              <>
                {detail && <AttemptDetailTabs detail={detail} />}
                {!detail && (
                  <div className='text-muted-foreground px-3 py-3 text-sm'>
                    Chua co du lieu phan tich chi tiet.
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
              {history.isPublic ? 'Make this private?' : 'Make this public?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {history.isPublic
                ? 'This attempt will no longer be visible to other users.'
                : 'This attempt will be visible to other users.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onToggleShare}
              disabled={toggleShareMutation.isPending}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

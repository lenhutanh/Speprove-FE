import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { useRetrySpeakingSessionMutation } from '@/queries'
import { SESSION_STATUS, SpeakingSessionResponseDto } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { enUS, vi } from 'date-fns/locale'
import {
  AlertCircle,
  CircleDollarSign,
  Eye,
  Loader2,
  Play,
  RotateCcw,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface MockTestItemProps {
  session: SpeakingSessionResponseDto
}

export default function MockTestItem({ session }: MockTestItemProps) {
  const locale = useLocale()
  const tModes = useTranslations('mock_test.setup.modes')
  const tHistory = useTranslations('mock_test.history')
  const dateLocale = locale === 'vi' ? vi : enUS
  const retrySpeakingSessionMutation = useRetrySpeakingSessionMutation()

  const parsedDate = session.startedAt ? new Date(session.startedAt) : null
  const timeAgo =
    parsedDate && !isNaN(parsedDate.getTime())
      ? formatDistanceToNow(parsedDate, {
          addSuffix: true,
          locale: dateLocale,
        })
      : ''

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mock_p1':
        return tModes('mock_p1.label')
      case 'mock_p2':
        return tModes('mock_p2.label')
      case 'mock_p3':
        return tModes('mock_p3.label')
      case 'full_test':
        return tModes('full_test.label')
      default:
        return type
    }
  }

  const queryClient = useQueryClient()

  const handleRetry = async () => {
    if (retrySpeakingSessionMutation.isPending) return

    toast.promise(
      retrySpeakingSessionMutation.mutateAsync(session.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['speaking-session-list'] })
        },
      }),
      {
        loading: 'Đang gửi yêu cầu chấm lại...',
        success: 'Đã gửi yêu cầu chấm lại thành công!',
        error: 'Gửi yêu cầu chấm lại thất bại.',
      },
    )
  }

  let statusBadge: React.ReactNode = null
  let actionButton: React.ReactNode = null

  const isFailedRefunded =
    session.status === SESSION_STATUS.FAILED && session.refundedAt != null
  const isFailedNotRefunded =
    session.status === SESSION_STATUS.FAILED && session.refundedAt == null

  if (
    session.status === SESSION_STATUS.NOT_STARTED ||
    session.status === SESSION_STATUS.IN_PROGRESS
  ) {
    const isNotStarted = session.status === SESSION_STATUS.NOT_STARTED
    statusBadge = (
      <Badge
        variant='outline'
        className='gap-1 rounded-md border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400'
      >
        <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
        {isNotStarted
          ? tHistory('status_not_started')
          : tHistory('status_in_progress')}
      </Badge>
    )
    actionButton = (
      <Button asChild size='sm'>
        <Link href={`/mock-test/${session.id}`}>
          <Play className='fill-current' />
          {tHistory('action_resume')}
        </Link>
      </Button>
    )
  } else if (session.status === SESSION_STATUS.PROCESSING) {
    statusBadge = (
      <Badge
        variant='outline'
        className='animate-pulse gap-1 rounded-md border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-400'
      >
        <Loader2 className='size-3 animate-spin text-blue-500 dark:text-blue-400' />
        {tHistory('status_processing')}
      </Badge>
    )
  } else if (session.status === SESSION_STATUS.COMPLETED) {
    const overallScore = session.result?.overall ?? 0
    const isHigh = overallScore >= 7.0
    statusBadge = (
      <Badge
        variant='outline'
        className={
          isHigh
            ? 'gap-1 rounded-md border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400'
            : 'gap-1 rounded-md border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400'
        }
      >
        <span
          className={
            isHigh
              ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
              : 'h-1.5 w-1.5 rounded-full bg-indigo-500'
          }
        />
        Band {overallScore.toFixed(1)}
      </Badge>
    )
    actionButton = (
      <Button asChild variant='outline' size='sm'>
        <Link href={`/mock-test/${session.id}/result`}>
          <Eye className='size-4' />
          {tHistory('action_view_result')}
        </Link>
      </Button>
    )
  } else if (isFailedNotRefunded) {
    statusBadge = (
      <Badge
        variant='outline'
        className='gap-1 rounded-md border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400'
      >
        <AlertCircle className='size-3 text-red-500 dark:text-red-400' />
        {tHistory('status_failed')}
      </Badge>
    )
    actionButton = (
      <Button
        variant='outline'
        size='sm'
        className='border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive'
        onClick={handleRetry}
        disabled={retrySpeakingSessionMutation.isPending}
      >
        {retrySpeakingSessionMutation.isPending ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <RotateCcw className='size-4' />
        )}
        {tHistory('retry')}
      </Button>
    )
  } else if (isFailedRefunded) {
    statusBadge = (
      <Badge
        variant='outline'
        className='gap-1 rounded-md border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-slate-400'
      >
        <CircleDollarSign className='size-3 text-slate-500 dark:text-slate-400' />
        {tHistory('status_refunded')}
      </Badge>
    )
  }

  return (
    <div className='bg-card hover:bg-accent/5 border-border flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200 sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr] sm:items-center'>
      <div className='flex w-full items-center justify-between sm:contents'>
        <div className='text-foreground truncate text-sm font-semibold sm:pr-2 sm:text-base'>
          {getTypeLabel(session.type)}
        </div>

        <div className='flex shrink-0 items-center sm:w-full'>
          {statusBadge}
        </div>
      </div>

      <div className='border-border/40 flex w-full items-center justify-between border-t border-dashed pt-2 sm:contents sm:border-0 sm:pt-0'>
        <div className='text-muted-foreground text-xs whitespace-nowrap sm:w-full sm:text-sm'>
          {timeAgo}
        </div>

        <div className='flex w-auto shrink-0 sm:w-full sm:justify-end'>
          {actionButton}
        </div>
      </div>
    </div>
  )
}

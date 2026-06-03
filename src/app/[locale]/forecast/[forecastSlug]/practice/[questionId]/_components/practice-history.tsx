'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Link, usePathname } from '@/i18n/navigation'
import { useAttemptListQuery } from '@/queries'
import route from '@/routes'
import { useAuthStore } from '@/store'
import { useQueryClient } from '@tanstack/react-query'
import { CalendarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import HistoryItem from './history-item'

export default function PracticeHistory({
  refreshSignal = 0,
}: {
  refreshSignal?: number
}) {
  const t = useTranslations('practice.history')
  const { questionId } = useParams<{ questionId: string }>()
  const [openAttemptId, setOpenAttemptId] = useState<string | null>(null)
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const { data, isLoading } = useAttemptListQuery({
    enabled: !!questionId && isAuthenticated,
    params: { forecastQuestionId: questionId },
    refetchInterval: (query) => {
      const histories = query.state.data?.data ?? []

      return histories.some((item) => [0, 1].includes(item.status))
        ? 2500
        : false
    },
  })
  const histories = data?.data || []

  const pathname = usePathname()

  useEffect(() => {
    if (!refreshSignal || !questionId) return

    queryClient.invalidateQueries({
      queryKey: ['attempt-list', { forecastQuestionId: questionId }],
    })
  }, [queryClient, questionId, refreshSignal])

  if (!isAuthenticated) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-2 px-4 text-center'>
        <p className='text-muted-foreground text-xs leading-relaxed'>
          {t('login_prefix')}{' '}
          <Link
            href={`${route.login}?returnUrl=${encodeURIComponent(pathname)}`}
            className='font-bold'
          >
            {t('login_link')}
          </Link>{' '}
          {t('login_suffix')} <br /> {t('login_history')}
        </p>
      </div>
    )
  }

  return (
    <div className='h-full space-y-2 overflow-y-auto p-3'>
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-14 rounded-lg' />
        ))}

      {!isLoading && histories.length === 0 && (
        <div className='flex h-full flex-col items-center justify-center gap-2 px-4 text-center'>
          <div className='bg-muted flex h-8 w-8 items-center justify-center rounded-full'>
            <CalendarIcon className='text-muted-foreground h-4 w-4' />
          </div>
          <p className='text-muted-foreground text-xs leading-relaxed'>
            {t('empty')}
            <br />
            {t('empty_hint')}
          </p>
        </div>
      )}

      {!isLoading &&
        histories.map((h) => (
          <HistoryItem
            key={h.id}
            history={h}
            open={openAttemptId === h.id}
            onOpenChange={(open) => setOpenAttemptId(open ? h.id : null)}
          />
        ))}
    </div>
  )
}

'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Link, usePathname } from '@/i18n/navigation'
import { useAttemptListQuery } from '@/queries'
import route from '@/routes'
import { useAuthStore } from '@/store'
import { CalendarIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import HistoryItem from './history-item'

export default function PracticeHistory() {
  const { questionId } = useParams<{ questionId: string }>()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading } = useAttemptListQuery({
    enabled: !!questionId && isAuthenticated,
    params: { forecastQuestionId: questionId },
  })
  const histories = data?.data || []

  const pathname = usePathname()

  if (!isAuthenticated) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-2 px-4 text-center'>
        <p className='text-muted-foreground text-xs leading-relaxed'>
          Vui lòng{' '}
          <Link
            href={`${route.login}?returnUrl=${encodeURIComponent(pathname)}`}
            className='font-bold'
          >
            đăng nhập
          </Link>{' '}
          để xem <br /> lịch sử luyện tập của bạn.
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
            Chưa có lịch sử luyện tập.
            <br />
            Hãy ghi âm câu đầu tiên!
          </p>
        </div>
      )}

      {!isLoading &&
        histories.map((h) => <HistoryItem key={h.id} history={h} />)}
    </div>
  )
}

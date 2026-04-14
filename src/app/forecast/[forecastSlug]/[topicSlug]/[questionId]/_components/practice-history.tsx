'use client'

import { Skeleton } from '@/components/ui/skeleton'
import HistoryItem from './history-item'
import { CalendarIcon } from 'lucide-react'
import { useAttemptListQuery } from '@/queries'
import { useParams } from 'next/navigation'
import { useAuthStore } from '@/store'

export default function PracticeHistory() {
  const { questionId } = useParams<{ questionId: string }>()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading } = useAttemptListQuery({ enabled: !!questionId && isAuthenticated, params: { forecastQuestionId: questionId } })
  const histories = data?.data || []
  return (
    <div className="h-full overflow-y-auto p-3 space-y-2">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}

      {!isLoading && histories.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
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

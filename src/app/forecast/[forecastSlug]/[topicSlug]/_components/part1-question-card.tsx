import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Part1QuestionCardProps {
  question: ForecastQuestionType
  index: number
  forecastSlug: string
  topicSlug: string
}

export default function Part1QuestionCard({ question, index, forecastSlug, topicSlug }: Part1QuestionCardProps) {
  const { content, practicedAt, band, id } = question
  const isPracticed = !!practicedAt

  const href = `/forecast/${forecastSlug}/${topicSlug}/${id}`

  return (
    <div className={cn(
      // 1. Thêm 'group' vào thẻ cha để bắt sự kiện hover cho thẻ con
      // Thêm 'hover:shadow-sm' để Card nổi lên nhẹ khi di chuột
      'group flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-4 transition-all hover:shadow-sm',
      isPracticed ? 'border-emerald-200' : 'border-border hover:border-primary/40'
    )}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={cn(
          'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors',
          isPracticed ? 'border-emerald-500 bg-emerald-500' : 'border-muted-foreground/30 group-hover:border-primary/50'
        )}>
          {isPracticed && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">
            {index}. {content}
          </p>
          {/* {isPracticed && band ? (
            <p className="text-xs text-muted-foreground mt-1">
              Band gần nhất: <span className="text-emerald-600 font-medium">{band}</span> · {practicedAt}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">Chưa luyện</p>
          )} */}
        </div>
      </div>

      <Button
        asChild
        size="sm"
        variant={isPracticed ? "outline" : "default"}
        className={cn(
          'transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100'
        )}
      >
        <Link href={href}>
          {isPracticed ? 'Luyện lại' : 'Luyện ngay'}
        </Link>
      </Button>
    </div>
  )
}
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import Link from 'next/link'

interface Part1QuestionCardProps {
  question: ForecastQuestionType
  index: number
  forecastSlug: string
  topicSlug: string
}

export default function Part1QuestionCard({
  question,
  index,
  forecastSlug,
  topicSlug,
}: Part1QuestionCardProps) {
  const { content, practicedAt, id } = question
  const isPracticed = !!practicedAt

  const href = `/forecast/${forecastSlug}/practice/${id}?source=topic&topicId=${topicSlug}`

  return (
    <div
      className={cn(
        'group bg-card flex items-center justify-between gap-4 rounded-xl border px-4 py-4 transition-all hover:shadow-sm',
        isPracticed
          ? 'border-emerald-200'
          : 'border-border hover:border-primary/40',
      )}
    >
      <div className='flex min-w-0 flex-1 items-start gap-3'>
        <div className='min-w-0 flex-1'>
          <p className='text-foreground text-sm leading-snug font-medium'>
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
        size='sm'
        variant={isPracticed ? 'outline' : 'default'}
        className={cn(
          'transition-opacity duration-200 focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
        )}
      >
        <Link href={href}>{isPracticed ? 'Luyện lại' : 'Luyện ngay'}</Link>
      </Button>
    </div>
  )
}

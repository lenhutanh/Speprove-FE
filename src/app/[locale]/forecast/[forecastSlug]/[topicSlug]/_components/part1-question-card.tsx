import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ForecastQuestionType } from '@/types'
import { useTranslations } from 'next-intl'

interface Part1QuestionCardProps {
  question: ForecastQuestionType
  index: number
  forecastSlug: string
}

export default function Part1QuestionCard({
  question,
  index,
  forecastSlug,
}: Part1QuestionCardProps) {
  const tCommon = useTranslations('common')
  const { content, practicedAt, id } = question
  const isPracticed = !!practicedAt

  const href = `/forecast/${forecastSlug}/practice/${id}`

  return (
    <Link
      href={href}
      className={cn(
        'group bg-card flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-4 transition-all hover:shadow-sm',
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
        </div>
      </div>

      <div
        className={cn(
          buttonVariants({
            variant: isPracticed ? 'outline' : 'default',
            size: 'sm',
          }),
          'hidden shrink-0 transition-opacity duration-200 focus-within:opacity-100 xl:inline-flex xl:opacity-0 xl:group-hover:opacity-100',
        )}
      >
        {isPracticed ? tCommon('practice_again') : tCommon('practice_now')}
      </div>
    </Link>
  )
}

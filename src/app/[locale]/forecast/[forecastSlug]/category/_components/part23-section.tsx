import { Skeleton } from '@/components/ui/skeleton'
import { ForecastQuestionType } from '@/types'
import CueCard from './cue-card'

interface Part23SectionProps {
  questions?: ForecastQuestionType[]
  isLoading: boolean
  forecastSlug: string
}

export default function Part23Section({
  questions,
  isLoading,
  forecastSlug,
}: Part23SectionProps) {
  if (isLoading) {
    return (
      <div className='space-y-6'>
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className='h-64 rounded-xl' />
        ))}
      </div>
    )
  }

  if (!questions?.length) {
    return (
      <div className='text-muted-foreground py-16 text-center text-sm'>
        Không có câu hỏi nào.
      </div>
    )
  }

  const cueCards = questions.filter(
    (q): q is Extract<ForecastQuestionType, { part: 2 }> => q.part === 2,
  )

  return (
    <div className='space-y-4'>
      {cueCards.map((cueCard) => (
        <CueCard
          key={cueCard.id}
          cueCard={cueCard}
          discussions={cueCard.childPart3 || []}
          forecastSlug={forecastSlug}
        />
      ))}
    </div>
  )
}

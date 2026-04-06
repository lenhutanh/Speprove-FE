import { Skeleton } from '@/components/ui/skeleton'
import CueCard from './cue-card'
import { ForecastQuestionType } from '@/types'

interface Part23SectionProps {
  questions?: ForecastQuestionType[]
  isLoading: boolean
  forecastSlug: string
  topicSlug: string    
}

export default function Part23Section({ questions, isLoading, forecastSlug, topicSlug }: Part23SectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    )
  }

  if (!questions?.length) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Không có câu hỏi nào.
      </div>
    )
  }

  const cueCards = questions.filter((q) => q.part === 2)

  return (
    <div className="space-y-4">
      {cueCards.map((cueCard, index) => (
        <CueCard
          key={cueCard.id}
          cueCard={cueCard}
          index={index + 1}
          discussions={cueCard.childPart3 || []}
          forecastSlug={forecastSlug}
          topicSlug={topicSlug}
        />
      ))}
    </div>
  )
}
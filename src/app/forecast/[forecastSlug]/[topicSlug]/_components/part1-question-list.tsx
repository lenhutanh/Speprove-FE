import { Skeleton } from '@/components/ui/skeleton'
import Part1QuestionCard from './part1-question-card'
import { ForecastQuestionType } from '@/types'

interface Part1QuestionListProps {
  questions?: ForecastQuestionType[]
  isLoading: boolean,
  forecastSlug: string,
  topicSlug: string
}

export default function Part1QuestionList({ questions, isLoading, forecastSlug, topicSlug }: Part1QuestionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {questions.map((q, index) => (
        <Part1QuestionCard key={q.id} question={q} index={index + 1} forecastSlug={forecastSlug} topicSlug={topicSlug} />
      ))}
    </div>
  )
}
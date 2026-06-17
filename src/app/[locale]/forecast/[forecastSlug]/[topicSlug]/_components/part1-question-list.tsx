import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { ForecastQuestionType } from '@/types'
import { FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Part1QuestionCard from './part1-question-card'

interface Part1QuestionListProps {
  questions?: ForecastQuestionType[]
  isLoading: boolean
  forecastSlug: string
  topicSlug: string
}

export default function Part1QuestionList({
  questions,
  isLoading,
  forecastSlug,
}: Part1QuestionListProps) {
  const tCommon = useTranslations('common')

  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-20 rounded-xl' />
        ))}
      </div>
    )
  }

  if (!questions?.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <FileText className='size-5' />
          </EmptyMedia>
          <EmptyTitle>{tCommon('no_questions')}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      {questions.map((q, index) => (
        <Part1QuestionCard
          key={q.id}
          question={q}
          index={index + 1}
          forecastSlug={forecastSlug}
        />
      ))}
    </div>
  )
}

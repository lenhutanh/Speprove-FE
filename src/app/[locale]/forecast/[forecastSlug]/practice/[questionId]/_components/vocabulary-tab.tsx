'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  VOCABULARY_SUGGESTION_LEVEL,
  VOCABULARY_SUGGESTION_LEVEL_OPTIONS,
  VocabularyLevel,
} from '@/constants'
import { useGetVocabularySuggestionQuery } from '@/queries'
import { BookOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import VocabularyItem from './vocabulary-item'

interface VocabularyTabProps {
  questionId: string
}

export default function VocabularyTab({ questionId }: VocabularyTabProps) {
  const t = useTranslations('practice.vocabulary')
  const [level, setLevel] = useState<VocabularyLevel>(
    VOCABULARY_SUGGESTION_LEVEL.BASIC,
  )
  const { data, isLoading } = useGetVocabularySuggestionQuery(questionId, level)
  const vocabularies = data?.data ?? []

  return (
    <div className='flex h-full flex-col overflow-hidden'>
      <Tabs
        value={level}
        onValueChange={(value) => setLevel(value as VocabularyLevel)}
        className='px-3 pt-3'
      >
        <TabsList className='w-full'>
          {VOCABULARY_SUGGESTION_LEVEL_OPTIONS.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {t(`levels.${option.value}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className='flex-1 space-y-3 overflow-y-auto p-3'>
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className='h-28 rounded-lg' />
          ))}

        {!isLoading && vocabularies.length === 0 && (
          <div className='flex h-full flex-col items-center justify-center gap-2 px-4 text-center'>
            <BookOpen className='text-muted-foreground/30 h-8 w-8' />
            <p className='text-muted-foreground text-xs leading-relaxed'>
              {t('empty')}
            </p>
          </div>
        )}

        {!isLoading &&
          vocabularies.map((item) => (
            <VocabularyItem key={item.id} vocabulary={item} />
          ))}
      </div>
    </div>
  )
}

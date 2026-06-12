import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
import { getVocabularyAudioQueryOptions } from '@/queries'
import { useAppPreference } from '@/store'
import { VocabularySuggestion } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

interface VocabularyItemProps {
  vocabulary: VocabularySuggestion
}

export default function VocabularyItem({ vocabulary }: VocabularyItemProps) {
  const t = useTranslations('practice.vocabulary')
  const queryClient = useQueryClient()
  const { voiceId } = useAppPreference()
  const levelLabel = t(`levels.${vocabulary.level}`)

  const resolveAudioUrl = useCallback(async () => {
    if (!voiceId) return undefined

    const res = await queryClient.fetchQuery(
      getVocabularyAudioQueryOptions(vocabulary.id, voiceId),
    )

    return res.data.audioUrl
  }, [queryClient, vocabulary.id, voiceId])

  return (
    <div className='border-border flex gap-3 rounded-lg border px-4 py-3'>
      <AudioPlayer
        variant='minimal'
        iconVariant='volume'
        resolveUrl={resolveAudioUrl}
      />

      <div className='min-w-0 flex-1 space-y-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <h3 className='text-sm font-semibold'>{vocabulary.text}</h3>
          <Badge variant='secondary' className='text-xs font-medium'>
            {vocabulary.type}
          </Badge>
          <Badge className='bg-indigo-50 text-xs font-medium text-indigo-700 hover:bg-indigo-50'>
            {levelLabel}
          </Badge>
        </div>

        <p className='text-muted-foreground text-xs leading-relaxed'>
          {vocabulary.meaning}
        </p>

        <p className='text-xs leading-relaxed text-slate-600 italic'>
          {vocabulary.example}
        </p>
      </div>
    </div>
  )
}

import { AudioPlayer } from '@/components/ui/audio-player'
import { Badge } from '@/components/ui/badge'
import { VocabularySuggestion } from '@/types'
import { useTranslations } from 'next-intl'

interface VocabularyItemProps {
  vocabulary: VocabularySuggestion
}

export default function VocabularyItem({ vocabulary }: VocabularyItemProps) {
  const t = useTranslations('practice.vocabulary')
  const levelLabel = t(`levels.${vocabulary.level}`)

  return (
    <div className='border-border flex gap-3 rounded-lg border px-4 py-3'>
      <AudioPlayer variant='minimal' iconVariant='volume' />

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

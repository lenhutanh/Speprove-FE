import { AudioPlayer } from '@/components/ui/audio-player'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VoiceType } from '@/types'
import { useTranslations } from 'next-intl'

interface ExaminerSelectorProps {
  voices: VoiceType[]
  value: string
  onChange: (id: string) => void
}

export default function VoiceSelector({
  voices,
  value,
  onChange,
}: ExaminerSelectorProps) {
  const t = useTranslations('mock_test.components.voice_selector')
  const selected = voices.find((voice) => voice.id === value)

  return (
    <div className='flex items-center gap-2 px-3 py-1.5'>
      <AudioPlayer
        url={selected?.sampleAudioUrl}
        variant='minimal'
        iconVariant='volume'
      />

      <Select value={value} onValueChange={(v) => onChange(v)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value=' '>{t('random')}</SelectItem>

            {voices.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {`${voice.name} - ${voice.locale}`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

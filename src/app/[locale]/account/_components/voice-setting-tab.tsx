import { AudioPlayer } from '@/components/ui/audio-player'
import { Field } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { useSelectVoiceMutation, useVoiceListQuery } from '@/queries'
import { useAppLoadingStore, useAppPreference, useAuthStore } from '@/store'
import { VoiceType } from '@/types'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const GENDER_LABEL: Record<number, string> = {
  0: 'Male',
  1: 'Female',
}

const LOCALE_LABEL: Record<string, string> = {
  'en-US': 'American',
  'en-GB': 'British',
  'en-AU': 'Australian',
  'en-CA': 'Canadian',
  'en-IN': 'Indian',
}

export default function VoiceSettingTab() {
  const selectVoiceMutation = useSelectVoiceMutation()
  const { data, isLoading } = useVoiceListQuery()
  const { user, setUser } = useAuthStore()
  const { setVoiceId } = useAppPreference()
  const { withLoading } = useAppLoadingStore()
  const voices = useMemo(() => data?.data ?? [], [data?.data])
  const currentSelectedVoiceId = user?.selectedVoiceId || ''
  const [optimisticSelectedVoiceId, setOptimisticSelectedVoiceId] = useState('')

  const selectedVoiceId = optimisticSelectedVoiceId || currentSelectedVoiceId

  const voicesByLocale = useMemo(() => {
    return voices.reduce<Record<string, VoiceType[]>>((acc, voice) => {
      const locale = voice.locale

      if (!acc[locale]) {
        acc[locale] = []
      }

      acc[locale].push(voice)

      return acc
    }, {})
  }, [voices])

  const handleSelectVoice = async (voiceId: string) => {
    if (
      !voiceId ||
      voiceId === selectedVoiceId ||
      selectVoiceMutation.isPending
    ) {
      return
    }

    const previousVoiceId = selectedVoiceId

    setOptimisticSelectedVoiceId(voiceId)

    try {
      const res = await withLoading(
        selectVoiceMutation.mutateAsync({ selectedVoiceId: voiceId }),
      )

      if (res.success) {
        toast.success(res.message || 'Voice updated successfully')
        setVoiceId(voiceId)

        if (user) {
          setUser({ ...user, selectedVoiceId: voiceId })
        }

        return
      }

      toast.error(res.message || 'Unable to update voice')
      setOptimisticSelectedVoiceId(previousVoiceId)
    } catch {
      toast.error('Unable to update voice')
      setOptimisticSelectedVoiceId(previousVoiceId)
    }
  }

  if (isLoading) {
    return (
      <div className='text-muted-foreground text-sm'>Loading voices...</div>
    )
  }

  if (!voices.length) {
    return (
      <div className='text-muted-foreground text-sm'>
        No voices are available.
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      {Object.entries(voicesByLocale).map(([locale, localeVoices]) => (
        <VoiceGroup
          key={locale}
          locale={locale}
          voices={localeVoices}
          selectedVoiceId={selectedVoiceId}
          disabled={selectVoiceMutation.isPending}
          onSelect={handleSelectVoice}
        />
      ))}
    </div>
  )
}

type VoiceGroupProps = {
  locale: string
  voices: VoiceType[]
  selectedVoiceId: string
  disabled?: boolean
  onSelect: (voiceId: string) => void
}

function VoiceGroup({
  locale,
  voices,
  selectedVoiceId,
  disabled,
  onSelect,
}: VoiceGroupProps) {
  return (
    <section className='space-y-3'>
      <h3 className='text-muted-foreground text-sm font-medium'>
        {LOCALE_LABEL[locale] ?? locale}
      </h3>

      <RadioGroup
        value={selectedVoiceId}
        disabled={disabled}
        onValueChange={onSelect}
        className='space-y-2'
        aria-label={locale}
      >
        {voices.map((voice) => (
          <VoiceRow
            key={voice.id}
            voice={voice}
            checked={selectedVoiceId === voice.id}
            disabled={disabled}
            onSelect={() => onSelect(voice.id)}
          />
        ))}
      </RadioGroup>
    </section>
  )
}

type VoiceRowProps = {
  voice: VoiceType
  checked: boolean
  disabled?: boolean
  onSelect: () => void
}

function VoiceRow({ voice, checked, disabled, onSelect }: VoiceRowProps) {
  return (
    <Field
      aria-disabled={disabled}
      orientation='horizontal'
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) {
          onSelect()
        }
      }}
      onKeyDown={(event) => {
        if (disabled) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        'border-border bg-background grid min-h-14 w-full grid-cols-4 items-center gap-3 rounded-lg border px-3 py-2 transition',
        checked && 'border-primary bg-primary/5 shadow-sm',
        disabled
          ? 'cursor-not-allowed opacity-70'
          : 'hover:border-primary/50 hover:bg-muted/40 cursor-pointer',
      )}
    >
      <RadioGroupItem
        value={voice.id}
        className='justify-self-center'
        onClick={(event) => event.stopPropagation()}
      />

      <div className='min-w-0 truncate text-center font-medium'>
        {voice.name}
      </div>

      <div className='text-muted-foreground truncate text-center text-sm'>
        {GENDER_LABEL[voice.gender] ?? voice.gender}
      </div>

      <div
        className='flex justify-center'
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {voice.sampleAudioUrl && (
          <AudioPlayer
            url={voice.sampleAudioUrl}
            variant='minimal'
            iconVariant='volume'
          />
        )}
      </div>
    </Field>
  )
}

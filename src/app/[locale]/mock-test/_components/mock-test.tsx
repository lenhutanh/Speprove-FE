'use client'

import { Container } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollableTabsList, Tabs, TabsTrigger } from '@/components/ui/tabs'
import { SpeakingSessionType } from '@/constants'
import { useNavigate } from '@/hooks'
import { usePathname } from '@/i18n/navigation'
import { useCreateSpeakingSessionMutation, useVoiceListQuery } from '@/queries'
import route from '@/routes'
import { useAppLoadingStore, useAuthStore } from '@/store'
import { VoiceType } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import VoiceSelector from './voice-selector'

export interface ExaminerOption {
  id: string
  name: string
  accent: string
  sampleAudioUrl: string
}

export const SPEAKING_PRICING: Record<SpeakingSessionType, number> = {
  mock_p1: 3,
  mock_p2: 5,
  mock_p3: 5,
  full_test: 10,
}

interface ModeConfig {
  id: SpeakingSessionType
  questions: string
  duration: string
}

const MODES: ModeConfig[] = [
  {
    id: 'mock_p1',
    questions: '4–6',
    duration: '4–5',
  },
  {
    id: 'mock_p2',
    questions: '1',
    duration: '3–4',
  },
  {
    id: 'mock_p3',
    questions: '4–5',
    duration: '4–5',
  },
  {
    id: 'full_test',
    questions: '10–14',
    duration: '11–14',
  },
]

function InfoCard({
  label,
  value,
  unit,
}: {
  label: string
  value: React.ReactNode
  unit?: React.ReactNode
}) {
  return (
    <div className='bg-muted/40 border-border flex flex-col items-center gap-1.5 rounded-xl border p-4'>
      <span className='text-muted-foreground text-xs font-medium'>{label}</span>
      <span className='text-2xl leading-none font-semibold'>{value}</span>
      {unit && (
        <span className='text-muted-foreground text-xs leading-none'>
          {unit}
        </span>
      )}
    </div>
  )
}

export default function MockTest() {
  const t = useTranslations('mock_test.setup')
  const tCommon = useTranslations('common')
  const tMsg = useTranslations('mock_test.messages')
  const [mode, setMode] = useState<SpeakingSessionType>('mock_p1')
  const { data: voiceListRes } = useVoiceListQuery()
  const voices = voiceListRes?.data || []
  const [voiceId, setVoiceId] = useState<string>(' ')
  const { isAuthenticated, user } = useAuthStore()
  const { withLoading } = useAppLoadingStore()
  const pathname = usePathname()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createSpeakingSessionMutation = useCreateSpeakingSessionMutation()

  const current = MODES.find((m) => m.id === mode)!
  const cost = SPEAKING_PRICING[mode]

  const handleStartMock = async (
    selectedMode: SpeakingSessionType,
    selectedVoiceId: string,
  ) => {
    if (!isAuthenticated || !user) {
      toast.error(tMsg('login_required'))
      navigate(`${route.login}?returnUrl=${encodeURIComponent(pathname)}`)
      return
    }

    if (user.balance < SPEAKING_PRICING[selectedMode]) {
      toast.error(tMsg('insufficient_balance'))
      navigate(`${route.payment}?returnUrl=${encodeURIComponent(pathname)}`)
      return
    }

    try {
      const res = await withLoading(
        createSpeakingSessionMutation.mutateAsync({
          type: selectedMode,
          voiceId: selectedVoiceId.trim() ? selectedVoiceId : undefined,
        }),
      )

      if (res.success && res.data?.id) {
        setMode(selectedMode)
        setVoiceId(selectedVoiceId)
        queryClient.invalidateQueries({ queryKey: ['profile'] })
        navigate(`${route.mockTest}/${res.data.id}`)
        return
      }

      toast.error(res.message ?? tMsg('create_session_error'))
    } catch {
      toast.error(tMsg('create_session_error'))
    }
  }

  return (
    <Container contentClassName='space-y-6'>
      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as SpeakingSessionType)}
        className='w-full'
      >
        <ScrollableTabsList containerClassName='w-full max-w-full'>
          {MODES.map((m) => (
            <TabsTrigger value={m.id} key={m.id} className='px-4'>
              {t(`modes.${m.id}.label`)}
            </TabsTrigger>
          ))}
        </ScrollableTabsList>
      </Tabs>

      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        <InfoCard
          label={t('info_labels.questions')}
          value={current.questions}
          unit={tCommon('questions')}
        />
        <InfoCard
          label={t('info_labels.duration')}
          value={current.duration}
          unit={tCommon('minutes')}
        />
        <InfoCard
          label={t('info_labels.topic')}
          value={t(`modes.${mode}.topic`)}
          unit={t(`modes.${mode}.topic_sub`)}
        />
        <InfoCard
          label={t('info_labels.cost')}
          value={
            <span className='flex items-baseline gap-1.5'>
              <span className='inline-block h-2.5 w-2.5 translate-y-[-1px] rounded-full bg-amber-400' />
              <span>{cost}</span>
              <span className='text-muted-foreground text-base font-normal'>
                {tCommon('points')}
              </span>
            </span>
          }
        />
      </div>

      <div className='bg-muted/20 border-border/30 rounded-xl border px-5 py-4 text-sm leading-relaxed'>
        {t.rich(`modes.${mode}.description`, {
          strong: (chunks) => <strong>{chunks}</strong>,
          em: (chunks) => <em>{chunks}</em>,
        })}
      </div>

      <div className='flex justify-center'>
        <SetupModal
          key={`${mode}-${voiceId}`}
          mode={mode}
          voices={voices}
          voiceId={voiceId}
          onStartMock={handleStartMock}
          isStarting={createSpeakingSessionMutation.isPending}
        />
      </div>
    </Container>
  )
}

interface SetupModalProps {
  mode: SpeakingSessionType
  voices: VoiceType[]
  voiceId: string
  onStartMock: (
    selectedMode: SpeakingSessionType,
    selectedVoiceId: string,
  ) => void
  isStarting?: boolean
}

function SetupModal({
  mode,
  voices,
  voiceId,
  onStartMock,
  isStarting = false,
}: SetupModalProps) {
  const t = useTranslations('mock_test.setup.modal')
  const tSetup = useTranslations('mock_test.setup')
  const tCommon = useTranslations('common')

  const [localMode, setLocalMode] = useState<SpeakingSessionType>(mode)
  const [localVoiceId, setLocalVoiceId] = useState<string>(voiceId)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{useTranslations('mock_test.setup')('start_button')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Field>
              <FieldLabel>{tCommon('part')}</FieldLabel>
              <Select
                value={localMode}
                onValueChange={(v) => setLocalMode(v as SpeakingSessionType)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='mock_p1'>
                    {tSetup('modes.mock_p1.label')}
                  </SelectItem>
                  <SelectItem value='mock_p2'>
                    {tSetup('modes.mock_p2.label')}
                  </SelectItem>
                  <SelectItem value='mock_p3'>
                    {tSetup('modes.mock_p3.label')}
                  </SelectItem>
                  <SelectItem value='full_test'>
                    {tSetup('modes.full_test.label')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>{tCommon('voice')}</FieldLabel>
              <VoiceSelector
                voices={voices}
                value={localVoiceId}
                onChange={setLocalVoiceId}
              />
            </Field>
          </div>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>{tCommon('cancel')}</Button>
          </DialogClose>
          <Button
            disabled={isStarting}
            onClick={() => onStartMock(localMode, localVoiceId)}
          >
            {t('start_now')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

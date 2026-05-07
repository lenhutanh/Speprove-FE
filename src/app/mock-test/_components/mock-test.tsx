'use client'

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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SpeakingSessionType } from '@/constants'
import { useNavigate } from '@/hooks'
import { useCreateSpeakingSessionMutation, useVoiceListQuery } from '@/queries'
import route from '@/routes'
import { useAuthStore } from '@/store'
import { VoiceType } from '@/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { MicChecker } from './mic-checker'
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
  label: string
  questions: string
  duration: string
  topic: string
  topicSub: string
  description: React.ReactNode
}

const MODES: ModeConfig[] = [
  {
    id: 'mock_p1',
    label: 'Part 1',
    questions: '4–6',
    duration: '4–5',
    topic: 'Random',
    topicSub: 'chủ đề ngẫu nhiên',
    description: (
      <>
        <strong>Part 1 — Giới thiệu &amp; Hỏi đáp ngắn.</strong> Giám khảo sẽ
        hỏi các câu hỏi về bản thân và các chủ đề quen thuộc. Câu hỏi sẽ{' '}
        <em>không hiển thị</em> — bạn chỉ nghe và trả lời như thi thật.
      </>
    ),
  },
  {
    id: 'mock_p2',
    label: 'Part 2',
    questions: '1',
    duration: '3–4',
    topic: 'Cue Card',
    topicSub: 'có phần ghi chú',
    description: (
      <>
        <strong>Part 2 — Trình bày dài (Long Turn).</strong> Bạn sẽ nhận một cue
        card và có 1 phút chuẩn bị, sau đó nói 1–2 phút. Cue card và phần ghi
        chú sẽ hiển thị đầy đủ.
      </>
    ),
  },
  {
    id: 'mock_p3',
    label: 'Part 3',
    questions: '4–5',
    duration: '4–5',
    topic: 'Thảo luận',
    topicSub: 'liên quan Part 2',
    description: (
      <>
        <strong>Part 3 — Thảo luận chuyên sâu.</strong> Các câu hỏi mang tính
        trừu tượng hơn, liên quan đến chủ đề Part 2. Câu hỏi sẽ{' '}
        <em>không hiển thị</em> — nghe và trả lời tự nhiên.
      </>
    ),
  },
  {
    id: 'full_test',
    label: 'Full Test',
    questions: '10–14',
    duration: '11–14',
    topic: 'Full Test',
    topicSub: 'Part 1 + 2 + 3',
    description: (
      <>
        <strong>Full Test — Mô phỏng thi thật.</strong> Hoàn thành toàn bộ 3
        parts liên tiếp đúng như format thi IELTS thật. Part 1, Part 2 (có cue
        card + ghi chú), và Part 3.
      </>
    ),
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
    <div className='bg-muted/40 border-border flex flex-col gap-1.5 rounded-xl border p-4'>
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
  const [mode, setMode] = useState<SpeakingSessionType>('mock_p1')
  const { data: voiceListRes, isLoading } = useVoiceListQuery()
  const voices = voiceListRes?.data || []
  const [voiceId, setVoiceId] = useState<string>(' ')
  const { isAuthenticated, user } = useAuthStore()
  const pathname = usePathname()
  const navigate = useNavigate()

  const createSpeakingSessionMutation = useCreateSpeakingSessionMutation()

  const current = MODES.find((m) => m.id === mode)!
  const cost = SPEAKING_PRICING[mode]

  const handleStartMock = async () => {
    if (!isAuthenticated || !user) {
      toast.error(
        <p>
          Vui lòng&nbsp;
          <Link
            href={`${route.login}?callbackUrl=${encodeURIComponent(pathname)}`}
            className='text-primary'
          >
            đăng nhập
          </Link>
          &nbsp;để thi thử
        </p>,
      )
      return
    }

    if (user.balance < SPEAKING_PRICING[mode]) {
      toast.error(
        <p>
          Số dư không đủ! Vui lòng&nbsp;
          <Link
            href={`${route.payment}?callbackUrl=${encodeURIComponent(pathname)}`}
            className='text-primary'
          >
            nạp thêm
          </Link>
        </p>,
      )
      return
    }

    await createSpeakingSessionMutation.mutateAsync(
      {
        type: mode,
        voiceId: voiceId.trim() ? voiceId : undefined,
      },
      {
        onSuccess: (res) => {
          if (res.success && res.data?.id) {
            navigate(`${route.mockTest}/${res.data.id}`)
          }
          if (!res.success) {
            toast.error(res.message)
          }
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi tạo phòng thi. Vui lòng thử lại!')
        },
      },
    )
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex flex-1 flex-col gap-5 px-4 py-5'>
        <div className='flex items-center gap-3'>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as SpeakingSessionType)}
          >
            <TabsList>
              {MODES.map((m) => (
                <TabsTrigger value={m.id} key={m.id} className='px-5'>
                  {m.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className='flex-1' />
        </div>

        <div className='grid grid-cols-4 gap-3'>
          <InfoCard
            label='Số câu hỏi'
            value={current.questions}
            unit='câu hỏi'
          />
          <InfoCard label='Thời gian' value={current.duration} unit='phút' />
          <InfoCard
            label='Chủ đề'
            value={current.topic}
            unit={current.topicSub}
          />
          <InfoCard
            label='Chi phí'
            value={
              <span className='flex items-baseline gap-1.5'>
                <span className='inline-block h-2.5 w-2.5 translate-y-[-1px] rounded-full bg-amber-400' />
                <span>{cost}</span>
                <span className='text-base font-normal text-zinc-400'>
                  điểm
                </span>
              </span>
            }
            // unit={
            //   canAfford ? (
            //     <span className='text-emerald-500'>Số dư: {balance} điểm</span>
            //   ) : (
            //     <span className='text-red-400'>Không đủ điểm (còn {balance})</span>
            //   )
            // }
          />
        </div>

        <div className='bg-muted/20 border-border/30 rounded-xl border px-5 py-4 text-sm leading-relaxed'>
          {current.description}
        </div>

        <div className='flex justify-center'>
          <SetupModal
            part={current.label}
            voices={voices}
            voiceId={voiceId}
            onVoiceChange={setVoiceId}
            onStartMock={handleStartMock}
          />
        </div>
      </main>
    </div>
  )
}

interface SetupModalProps {
  part: string
  voices: VoiceType[]
  voiceId: string
  onVoiceChange: (value: string) => void
  onStartMock: () => void
}

function SetupModal({
  part,
  voices,
  voiceId,
  onVoiceChange,
  onStartMock,
}: SetupModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Bắt đầu thi thử</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chuẩn bị thi {part}</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Microphone</FieldLabel>
            <MicChecker />
          </Field>
          <Field>
            <FieldLabel>Giọng đọc</FieldLabel>
            <VoiceSelector
              voices={voices}
              value={voiceId}
              onChange={onVoiceChange}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Hủy</Button>
          </DialogClose>
          <Button onClick={onStartMock}>Vào thi ngay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

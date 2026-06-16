'use client'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import route from '@/routes'
import { History, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import MockTestItem from './mock-test-item'

export interface MockSession {
  id: string
  type: string
  status: 'IN_PROGRESS' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  refundedAt?: string | null
  result?: {
    overall: number | null
  } | null
  createdAt: Date | string
}

const INITIAL_MOCK_SESSIONS: MockSession[] = [
  {
    id: '1',
    type: 'full_test',
    status: 'PROCESSING',
    refundedAt: null,
    createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
  },
  {
    id: '2',
    type: 'full_test',
    status: 'COMPLETED',
    result: { overall: 6.5 },
    refundedAt: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '3',
    type: 'mock_p1',
    status: 'IN_PROGRESS',
    refundedAt: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // Today, 5 hours ago
  },
  {
    id: '4',
    type: 'full_test',
    status: 'FAILED',
    refundedAt: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  },
  {
    id: '5',
    type: 'mock_p2',
    status: 'FAILED',
    refundedAt: '2026-06-14T04:30:00.000Z',
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000), // Yesterday, older
  },
]

export default function MockTestHistoryTab() {
  const [sessions, setSessions] = useState<MockSession[]>(INITIAL_MOCK_SESSIONS)
  const [retryingIds, setRetryingIds] = useState<Record<string, boolean>>({})

  const handleRetry = (id: string) => {
    if (retryingIds[id]) return

    setRetryingIds((prev) => ({ ...prev, [id]: true }))
    toast.info('Đang gửi yêu cầu chấm lại...')

    setTimeout(() => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: 'PROCESSING', createdAt: new Date() } // moves to newest and status is PROCESSING
            : s,
        ),
      )
      setRetryingIds((prev) => ({ ...prev, [id]: false }))
      toast.success(
        'Đã gửi yêu cầu chấm lại thành công! Trạng thái đang chuyển sang Processing.',
      )
    }, 1200)
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className='space-y-4'>
      <div className='bg-accent/5 border-border/80 flex justify-end gap-2 rounded-lg border border-dashed p-2'>
        <Button
          variant='outline'
          size='xs'
          onClick={() => setSessions(INITIAL_MOCK_SESSIONS)}
          disabled={
            sessions.length === INITIAL_MOCK_SESSIONS.length &&
            sessions.every((s) => {
              const initial = INITIAL_MOCK_SESSIONS.find((i) => i.id === s.id)
              return initial && initial.status === s.status
            })
          }
          className='h-7 text-xs'
        >
          <RefreshCw className='mr-1.5 size-3' /> Reset Mock History
        </Button>
        <Button
          variant='outline'
          size='xs'
          onClick={() => setSessions([])}
          disabled={sessions.length === 0}
          className='text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-7 text-xs'
        >
          <Trash2 className='mr-1.5 size-3' /> Clear (Test Empty State)
        </Button>
      </div>

      {sortedSessions.length > 0 ? (
        <div className='space-y-3'>
          {sortedSessions.map((session) => (
            <MockTestItem
              key={session.id}
              session={session}
              onRetry={handleRetry}
              isRetrying={!!retryingIds[session.id]}
            />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <History />
            </EmptyMedia>
            <EmptyTitle>No mock tests yet</EmptyTitle>
            <EmptyDescription>
              Start your first IELTS Speaking mock test to receive AI feedback
              and band scores.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size='sm' className='h-9 gap-1.5 px-4'>
              <Link href={route.mockTest}>
                <Plus className='size-4' /> Start Mock Test
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}

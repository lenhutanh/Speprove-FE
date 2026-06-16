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
import { Skeleton } from '@/components/ui/skeleton'

import { Link } from '@/i18n/navigation'
import { useSpeakingSessionListQuery } from '@/queries'
import route from '@/routes'
import { History, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import MockTestItem from './mock-test-item'

function MockTestItemSkeleton() {
  return (
    <div className='bg-card border-border flex flex-col gap-3 rounded-xl border p-4 sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr] sm:items-center'>
      <div className='flex w-full items-center justify-between sm:contents'>
        <div className='sm:pr-2'>
          <Skeleton className='h-5 w-24' />
        </div>
        <div className='flex shrink-0 items-center sm:w-full'>
          <Skeleton className='h-6 w-20 rounded-md' />
        </div>
      </div>
      <div className='border-border/40 flex w-full items-center justify-between border-t border-dashed pt-2 sm:contents sm:border-0 sm:pt-0'>
        <Skeleton className='h-4 w-20 sm:w-full' />
        <div className='flex w-auto shrink-0 sm:w-full sm:justify-end'>
          <Skeleton className='h-8 w-24 rounded-lg' />
        </div>
      </div>
    </div>
  )
}

export default function MockTestHistoryTab() {
  const t = useTranslations('mock_test.history')
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useSpeakingSessionListQuery()

  if (isLoading) {
    return (
      <div className='space-y-3'>
        <MockTestItemSkeleton />
        <MockTestItemSkeleton />
        <MockTestItemSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='bg-card border-border flex flex-col items-center justify-center rounded-xl border p-8 text-center'>
        <p className='text-destructive mb-3 text-sm font-medium'>
          {t('loading_error')}
        </p>
        <Button onClick={() => refetch()} variant='outline' size='sm'>
          {t('retry')}
        </Button>
      </div>
    )
  }

  const sessions = response?.data ?? []
  const sortedSessions = [...sessions].sort((a, b) => {
    const timeA = a.startedAt ? new Date(a.startedAt).getTime() : 0
    const timeB = b.startedAt ? new Date(b.startedAt).getTime() : 0
    return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA)
  })

  return (
    <div className='space-y-4'>
      {sortedSessions.length > 0 ? (
        <div className='h-[calc(100vh-290px)] overflow-y-auto md:h-[calc(100vh-325px)] lg:h-[calc(100vh-235px)]'>
          <div className='space-y-3'>
            {sortedSessions.map((session) => (
              <MockTestItem key={session.id} session={session} />
            ))}
          </div>
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <History />
            </EmptyMedia>
            <EmptyTitle>{t('no_sessions')}</EmptyTitle>
            <EmptyDescription>{t('no_sessions_desc')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size='sm' className='h-9 gap-1.5 px-4'>
              <Link href={route.mockTest}>
                <Plus className='size-4' /> {t('start_test')}
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}

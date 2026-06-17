'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@/i18n/navigation'
import {
  useRetrySpeakingSessionMutation,
  useSpeakingSessionQuery,
  useVoiceListQuery,
} from '@/queries'
import { SESSION_STATUS } from '@/types'
import { useQueryClient } from '@tanstack/react-query'
import { AlertCircle, ArrowLeft, Loader2, Play, RotateCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import { QuestionAttemptList } from './question-attempt-list'
import { ResultScoreCard } from './result-score-card'

interface MockTestResultProps {
  speakingSessionId: string
}

export default function MockTestResult({
  speakingSessionId,
}: MockTestResultProps) {
  const t = useTranslations('mock_test.result')
  const tHistory = useTranslations('mock_test.history')
  const tRoom = useTranslations('mock_test.room')
  const queryClient = useQueryClient()
  const [isRetrying, setIsRetrying] = useState(false)

  const cachedSession = queryClient.getQueryData<any>([
    'speaking-session',
    speakingSessionId,
  ])
  const sessionStatus = cachedSession?.data?.status

  const {
    data: sessionRes,
    error,
    isLoading,
  } = useSpeakingSessionQuery(speakingSessionId, {
    refetchInterval:
      sessionStatus === SESSION_STATUS.IN_PROGRESS ||
      sessionStatus === SESSION_STATUS.PROCESSING
        ? 3000
        : false,
  })

  const { data: voiceListRes } = useVoiceListQuery()
  const voices = voiceListRes?.data || []

  const retryMutation = useRetrySpeakingSessionMutation()

  const session = sessionRes?.data

  const handleRetry = async () => {
    if (isRetrying) return
    setIsRetrying(true)

    toast.promise(
      retryMutation.mutateAsync(speakingSessionId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['speaking-session', speakingSessionId],
          })
          queryClient.invalidateQueries({
            queryKey: ['speaking-session-list'],
          })
        },
      }),
      {
        loading: 'Đang gửi yêu cầu chấm điểm lại...',
        success: 'Đã gửi yêu cầu chấm lại thành công!',
        error: 'Gửi yêu cầu chấm lại thất bại.',
        finally: () => setIsRetrying(false),
      },
    )
  }

  if (isLoading) {
    return <ResultSkeleton />
  }

  if (error || !session) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center gap-4 text-center'>
        <div className='rounded-full bg-red-50 p-4 text-red-500 dark:bg-red-950/20'>
          <AlertCircle className='size-10' />
        </div>
        <h2 className='text-lg font-semibold'>{t('error')}</h2>
        <Button asChild variant='outline' size='sm' className='mt-2'>
          <Link href='/account?tab=mock_test_history'>
            <ArrowLeft className='mr-2 size-4' />
            {tRoom('view_history')}
          </Link>
        </Button>
      </div>
    )
  }

  if (
    session.status === SESSION_STATUS.PROCESSING ||
    session.status === SESSION_STATUS.IN_PROGRESS ||
    session.status === SESSION_STATUS.NOT_STARTED
  ) {
    const isProcessing = session.status === SESSION_STATUS.PROCESSING

    return (
      <div className='flex min-h-[450px] flex-col items-center justify-center gap-6 px-4 text-center'>
        <div className='relative flex items-center justify-center'>
          <div className='absolute h-20 w-20 animate-ping rounded-full bg-indigo-500/20' />
          <div className='relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'>
            <Loader2 className='size-8 animate-spin' />
          </div>
        </div>

        <div className='max-w-md space-y-2'>
          <h2 className='text-xl font-bold tracking-tight'>
            {isProcessing
              ? tHistory('status_processing')
              : tHistory('status_in_progress')}
          </h2>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            {isProcessing
              ? 'Giám khảo AI đang phân tích và chấm điểm bài phát âm, ngữ pháp, từ vựng và độ trôi chảy của bạn. Vui lòng đợi trong giây lát...'
              : 'Bài thi thử của bạn đang được tiến hành và chưa hoàn tất.'}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Button asChild variant='outline' size='sm'>
            <Link href='/account?tab=mock_test_history'>
              <ArrowLeft className='mr-2 size-4' />
              {tRoom('view_history')}
            </Link>
          </Button>

          {!isProcessing && (
            <Button asChild size='sm'>
              <Link href={`/mock-test/${speakingSessionId}`}>
                <Play className='mr-2 size-4 fill-current' />
                {tHistory('action_resume')}
              </Link>
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (session.status === SESSION_STATUS.FAILED) {
    return (
      <div className='flex min-h-[400px] flex-col items-center justify-center gap-6 px-4 text-center'>
        <div className='rounded-full bg-red-50 p-4 text-red-500 dark:bg-red-950/20'>
          <AlertCircle className='size-10' />
        </div>

        <div className='max-w-md space-y-2'>
          <h2 className='text-xl font-bold tracking-tight'>
            {tHistory('status_failed')}
          </h2>
          <p className='text-muted-foreground text-sm'>
            Có lỗi xảy ra trong quá trình chấm điểm tự động bằng AI. Bạn có thể
            yêu cầu chấm điểm lại bài thi này.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Button asChild variant='outline' size='sm'>
            <Link href='/account?tab=mock_test_history'>
              <ArrowLeft className='mr-2 size-4' />
              {tRoom('view_history')}
            </Link>
          </Button>

          <Button
            size='sm'
            onClick={handleRetry}
            disabled={isRetrying}
            className='gap-1.5'
          >
            {isRetrying ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <RotateCcw className='size-4' />
            )}
            Chấm lại bài thi
          </Button>
        </div>
      </div>
    )
  }

  const examinerVoice = voices.find((v) => v.id === session.voiceId)

  return (
    <div className='flex flex-col gap-6 py-6'>
      <ResultScoreCard session={session} examinerVoice={examinerVoice} />

      {session.attempts && session.attempts.length > 0 && (
        <QuestionAttemptList attempts={session.attempts} />
      )}
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className='flex animate-pulse flex-col gap-6 py-6'>
      <div className='bg-card border-border space-y-6 rounded-xl border p-5'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-20' />
            <div className='flex items-baseline gap-2'>
              <Skeleton className='h-10 w-16' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>
        </div>

        <div className='border-border grid grid-cols-4 gap-4 border-y py-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='flex flex-col items-center gap-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-6 w-10' />
            </div>
          ))}
        </div>

        <div className='flex flex-wrap items-center gap-6'>
          <Skeleton className='h-4 w-36' />
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>

      <div className='bg-card border-border space-y-4 rounded-xl border p-5'>
        <div className='border-border flex gap-4 border-b pb-2'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-8 w-20' />
        </div>

        <div className='flex items-center justify-between py-2'>
          <Skeleton className='h-4 w-24' />
        </div>

        <div className='space-y-3'>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className='h-14 rounded-lg' />
          ))}
        </div>
      </div>
    </div>
  )
}

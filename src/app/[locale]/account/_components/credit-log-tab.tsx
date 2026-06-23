'use client'

import { AppPagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import SearchInput from '@/components/ui/search-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryParams } from '@/hooks'
import { cn } from '@/lib/utils'
import { useCreditLogListQuery } from '@/queries'
import { CreditLogQueryParams } from '@/types'
import { format } from 'date-fns'
import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  History,
  RotateCcw,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

function CreditLogItemSkeleton() {
  return (
    <div className='bg-card border-border flex items-start gap-4 rounded-xl border p-4'>
      <Skeleton className='size-10 shrink-0 rounded-lg' />
      <div className='flex-1 space-y-2.5'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-5 w-1/3' />
          <Skeleton className='h-5 w-16' />
        </div>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
      </div>
    </div>
  )
}

export default function CreditLogTab() {
  const t = useTranslations('credit_log')
  const { paramsObj, setQueryParams } = useQueryParams<CreditLogQueryParams>()

  const page = Number(paramsObj.page) || 1
  const limit = 10
  const search = paramsObj.search || undefined
  const refType = paramsObj.refType || undefined

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useCreditLogListQuery({
    page,
    limit,
    search,
    refType,
  })

  const handleFilterChange = (value: string) => {
    setQueryParams(
      {
        refType: value === 'all' ? '' : value,
        page: 1,
      },
      { keepPage: false },
    )
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Skeleton className='h-9 w-full sm:max-w-xs' />
          <Skeleton className='h-9 w-full sm:w-48' />
        </div>
        <div className='space-y-3'>
          <CreditLogItemSkeleton />
          <CreditLogItemSkeleton />
          <CreditLogItemSkeleton />
          <CreditLogItemSkeleton />
          <CreditLogItemSkeleton />
        </div>
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

  const listData = response?.data?.data ?? []
  const pagination = response?.data?.pagination

  const getTransactionIcon = (type: 'plus' | 'minus', rType: string) => {
    if (rType === 'refund') {
      return (
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
          <RotateCcw className='size-5' />
        </div>
      )
    }

    if (type === 'plus') {
      return (
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
          <ArrowUpRight className='size-5' />
        </div>
      )
    }

    return (
      <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400'>
        <ArrowDownRight className='size-5' />
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <SearchInput
          paramKey='search'
          placeholder={t('search_placeholder')}
          className='w-full sm:max-w-xs'
        />

        <Select value={refType || 'all'} onValueChange={handleFilterChange}>
          <SelectTrigger className='w-full sm:w-48'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectItem value='all'>{t('filter_all')}</SelectItem>
            <SelectItem value='payment'>{t('filter_payment')}</SelectItem>
            <SelectItem value='usage'>{t('filter_usage')}</SelectItem>
            <SelectItem value='refund'>{t('filter_refund')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-3'>
        {listData.length > 0 ? (
          <>
            <div className='flex flex-col gap-3'>
              {listData.map((item) => {
                const isPlus = item.type === 'plus'
                const formattedDate = item.createdAt
                  ? format(new Date(item.createdAt), 'HH:mm - dd/MM/yyyy')
                  : ''

                return (
                  <div
                    key={item.id}
                    className='bg-card hover:bg-accent/5 border-border flex items-center gap-4 rounded-xl border p-4 transition-all duration-200'
                  >
                    {getTransactionIcon(item.type, item.refType)}

                    <div className='flex-1 space-y-1.5'>
                      <div className='flex items-start justify-between gap-4'>
                        <span className='text-foreground text-sm font-medium sm:text-base'>
                          {item.description}
                        </span>
                        <span
                          className={cn(
                            'text-base font-semibold whitespace-nowrap',
                            isPlus
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400',
                          )}
                        >
                          {isPlus ? '+' : '-'}
                          {item.amount}
                        </span>
                      </div>

                      <div className='text-muted-foreground flex items-center justify-between text-xs'>
                        <span>{formattedDate}</span>
                        <span>
                          {t('balance_label', {
                            balance: String(item.balanceAfter),
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <AppPagination meta={pagination} />
          </>
        ) : (
          <Empty className='py-12'>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                {search || refType ? <History /> : <Coins />}
              </EmptyMedia>
              <EmptyTitle>{t('empty')}</EmptyTitle>
              <EmptyDescription>{t('empty_desc')}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  )
}

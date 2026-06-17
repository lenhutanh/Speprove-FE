'use client'

import { Container } from '@/components/layout'
import { AppPagination } from '@/components/pagination'
import ForecastList from './_components/forecast-list'

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import SearchInput from '@/components/ui/search-input'
import { Skeleton } from '@/components/ui/skeleton'
import { useValidatedParams } from '@/hooks'
import { useForecastListQuery } from '@/queries'
import { forecastListQuerySchema } from '@/validations'
import { keepPreviousData } from '@tanstack/react-query'
import { FolderOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ForecastPage() {
  const t = useTranslations('forecast')
  const { limit, page, quarter, year, search, sortOrder } = useValidatedParams(
    forecastListQuerySchema,
  )
  const forecastListQuery = useForecastListQuery({
    params: { limit, page, quarter, year, search, sortOrder },
    enabled: true,
    placeholderData: keepPreviousData,
  })
  const forecasts = forecastListQuery?.data?.data || []
  const isLoading = forecastListQuery.isLoading

  return (
    <Container contentClassName='space-y-6'>
      <div className='flex gap-4'>
        <SearchInput className='w-full sm:w-xs' />
        {/* <SelectInput paramKey='quarter' options={QUARTER_OPTIONS} placeholder='Chọn quý...' />
          <SelectInput paramKey='year' options={generateYearOptions(2025)} placeholder='Chọn năm...' /> */}
      </div>
      {isLoading ? (
        <ForecastListSkeleton />
      ) : forecasts.length > 0 ? (
        <>
          <ForecastList forecasts={forecasts} />
          <AppPagination meta={forecastListQuery?.data?.meta} />
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <FolderOpen className='size-5' />
            </EmptyMedia>
            <EmptyTitle>{t('no_forecasts_yet')}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </Container>
  )
}

function ForecastListSkeleton() {
  return (
    <div className='grid w-full grid-cols-2 gap-4 max-[380px]:grid-cols-1 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className='h-48 rounded-xl' />
      ))}
    </div>
  )
}

'use client'

import { Container } from '@/components/layout'
import { AppPagination } from '@/components/pagination'
import ForecastList from './_components/forecast-list'

import SearchInput from '@/components/ui/search-input'
import { useValidatedParams } from '@/hooks'
import { useForecastListQuery } from '@/queries'
import { forecastListQuerySchema } from '@/validations'
import { keepPreviousData } from '@tanstack/react-query'

export default function ForecastPage() {
  const { limit, page, quarter, year, search } = useValidatedParams(
    forecastListQuerySchema,
  )
  const forecastListQuery = useForecastListQuery({
    params: { limit, page, quarter, year, search },
    enabled: true,
    placeholderData: keepPreviousData,
  })
  const forecasts = forecastListQuery?.data?.data || []
  return (
    <Container>
      <div className='space-y-6'>
        <div className='flex gap-4'>
          <SearchInput className='w-full sm:w-xs' />
          {/* <SelectInput paramKey='quarter' options={QUARTER_OPTIONS} placeholder='Chọn quý...' />
          <SelectInput paramKey='year' options={generateYearOptions(2025)} placeholder='Chọn năm...' /> */}
        </div>
        <ForecastList forecasts={forecasts} />
        <AppPagination meta={forecastListQuery?.data?.meta} />
      </div>
    </Container>
  )
}

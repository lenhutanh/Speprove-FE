'use client'

import { Container } from '@/components/layout'
import { AppPagination } from '@/components/pagination'
import ForecastList from './_components/forecast-list'

import { useValidatedParams } from '@/hooks'
import { useForecastListQuery } from '@/queries'
import { baseSearchSchema } from '@/schemaValidations'

export default function ForecastPage() {
  const params = useValidatedParams(baseSearchSchema)
  const forecastListQuery = useForecastListQuery({ params, enabled: true })
  const forecasts = forecastListQuery?.data?.data || []
  return (
    <Container>
      <ForecastList forecasts={forecasts} />
      <AppPagination totalPages={forecastListQuery?.data?.meta?.totalPages} />
    </Container>
  )
}

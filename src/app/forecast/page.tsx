'use client'

import { Container } from '@/components/layout'
import { AppPagination } from '@/components/pagination'
import ForecastList from './_components/forecast-list'

import { useValidatedParams } from '@/hooks'
import { useForecastListQuery } from '@/queries'
import { forecastQuerySchema } from '@/validations/forecast.schema'

export default function ForecastPage() {
  const params = useValidatedParams(forecastQuerySchema)
  const forecastListQuery = useForecastListQuery({ params, enabled: true })
  const forecasts = forecastListQuery?.data?.data || []
  return (
    <Container>
      <ForecastList forecasts={forecasts} />
      <AppPagination meta={forecastListQuery?.data?.meta} />
    </Container>
  )
}

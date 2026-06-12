'use client'

import { Breadcrumb } from '@/components/breadcrumb'
import SearchInput from '@/components/ui/search-input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PART_GROUP } from '@/constants'
import { useQueryParams, useValidatedParams } from '@/hooks'
import { useForecastQuery } from '@/queries'
import route from '@/routes'
import { forecastDetailQuerySchema } from '@/validations'
import { useTranslations } from 'next-intl'
import { notFound, useParams } from 'next/navigation'
import CategoryListSection from './category-list'
import ForecastInfo from './forecast-info'
import TopicListSection from './topic-list'

export default function ForecastDetail() {
  const t = useTranslations('forecast')
  const tNav = useTranslations('header.nav')
  const { forecastSlug } = useParams<{ forecastSlug: string }>()
  const id = forecastSlug.split('.')[1]

  const { part } = useValidatedParams(forecastDetailQuerySchema)
  const { setQueryParams } = useQueryParams()

  const forecastQuery = useForecastQuery(id)
  const forecast = forecastQuery.data?.data

  if (forecastQuery.isLoading) {
    return <ForecastDetailSkeleton />
  }

  if (forecastQuery.isError || !forecast) {
    notFound()
  }

  const handleTabChange = (value: string) => {
    setQueryParams({ part: value })
  }

  return (
    <div className='mx-auto px-6'>
      <Breadcrumb
        items={[
          { label: tNav('forecast'), href: route.forecast },
          { label: forecast.name },
        ]}
      />
      <ForecastInfo forecast={forecast} />
      <Tabs value={String(part)} onValueChange={handleTabChange}>
        <div className='mb-6 flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value={PART_GROUP.PART1} className='cursor-pointer'>
              Part 1
            </TabsTrigger>
            <TabsTrigger value={PART_GROUP.PART23} className='cursor-pointer'>
              Part 2 & 3
            </TabsTrigger>
          </TabsList>

          {part === PART_GROUP.PART1 && (
            <SearchInput
              placeholder={t('search_topic')}
              className='w-full sm:w-xs'
            />
          )}
        </div>

        <TabsContent value={PART_GROUP.PART1}>
          <TopicListSection forecastId={id} forecastSlug={forecastSlug} />
        </TabsContent>

        <TabsContent value={PART_GROUP.PART23}>
          <CategoryListSection forecastId={id} forecastSlug={forecastSlug} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ForecastDetailSkeleton() {
  return (
    <div className='mx-auto max-w-330 space-y-6 px-6 py-8'>
      <div className='space-y-3'>
        <Skeleton className='h-5 w-24' />
        <Skeleton className='h-8 w-2/3' />
        <Skeleton className='h-4 w-1/3' />
      </div>
      <div className='grid grid-cols-3 gap-3'>
        <Skeleton className='h-20 rounded-xl' />
        <Skeleton className='h-20 rounded-xl' />
        <Skeleton className='h-20 rounded-xl' />
      </div>
      <div className='grid grid-cols-2 gap-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl' />
        ))}
      </div>
    </div>
  )
}

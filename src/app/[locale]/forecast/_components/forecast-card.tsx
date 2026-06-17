'use client'
import { forecastThumbnail } from '@/assets'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import route from '@/routes'
import { ForecastType } from '@/types'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function ForecastCard({ forecast }: { forecast: ForecastType }) {
  const tCommon = useTranslations('common')

  return (
    <Link
      href={`${route.forecast}/${forecast.slug}.${forecast.id}`}
      className={cn(
        'group bg-card flex h-full flex-col rounded-xl border p-4 sm:p-5',
        'hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 hover:shadow-sm',
      )}
    >
      <div className='mb-4 flex w-full justify-center rounded-lg'>
        <Image
          src={forecastThumbnail}
          alt={forecast?.name ?? ''}
          width={120}
          className='object-cover'
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='line-clamp-2 text-sm leading-snug font-semibold'>
          {forecast?.name}
        </div>
        <span className='text-muted-foreground text-xs'>
          5 {tCommon('topics')}
        </span>
      </div>
    </Link>
  )
}

'use client'
import { forecastThumbnail } from '@/assets'
import route from '@/routes'
import { ForecastType } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default function ForecastCard({ forecast }: { forecast: ForecastType }) {
  return (
    <Link
      href={`${route.forecast}/${forecast.slug}.${forecast.id}`}
      className='group rounded-xl border p-5 
                hover:bg-accent
                transition-colors duration-200 ease-in-out'
    >
      <div className='mb-4 w-full rounded-lg flex justify-center'>
        <Image
          src={forecastThumbnail}
          alt={forecast?.name ?? ''}
          width={120}
          className='object-cover'
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <div className='font-semibold text-sm leading-snug line-clamp-2'>
          {forecast?.name}
        </div>
        <span className='text-xs text-muted-foreground'>
          5 chủ đề
        </span>
      </div>
    </Link>
  )
}
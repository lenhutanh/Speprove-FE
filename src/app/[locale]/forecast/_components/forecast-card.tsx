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
      className='group hover:bg-accent rounded-xl border p-5 transition-colors duration-200 ease-in-out'
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
        <span className='text-muted-foreground text-xs'>5 chủ đề</span>
      </div>
    </Link>
  )
}

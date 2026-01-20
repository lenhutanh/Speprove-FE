'use client'
import { forecastThumbnail } from '@/assets'
import route from '@/routes'
import { ForecastResType } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default function ForecastCard({
  forecast,
}: {
  forecast: ForecastResType
}) {
  return (
    <Link
      href={route.home}
      className='rounded-xl border p-6 hover:backdrop-brightness-97'
    >
      <div className='mb-3 w-full'>
        <Image
          src={forecastThumbnail}
          alt={''}
          width={120}
          height={180}
          className='object-cover'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <div className='font-bold'>{forecast?.name}</div>
        <span className='text-sm'>46 chủ đề</span>
      </div>
    </Link>
  )
}

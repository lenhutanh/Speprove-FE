'use client'

import { forecastThumbnail } from '@/assets'
import { cn } from '@/lib/utils'
import { ForecastType } from '@/types'
import { BookOpen, CalendarDays, Layers, TrendingUp } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

interface ForecastInfoProps {
  forecast: ForecastType
}

export default function ForecastInfo({ forecast }: ForecastInfoProps) {
  const locale = useLocale()
  const tCommon = useTranslations('common')
  const { name, description, thumbnail, validFrom, validTo, stats } = forecast

  const progressPct =
    stats && stats.totalQuestions > 0
      ? Math.round((stats.practicedQuestions / stats.totalQuestions) * 100)
      : 0

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString(locale, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : null

  return (
    <div className='mb-8 space-y-4'>
      {/* Thumbnail + Info */}
      <div className='flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left'>
        {/* Thumbnail lớn bên trái */}
        <Image
          src={thumbnail || forecastThumbnail}
          alt={name}
          className='w-36 flex-shrink-0 rounded-xl object-cover'
        />

        {/* Info bên phải */}
        <div className='flex min-w-0 flex-1 flex-col items-center space-y-1.5 sm:items-start'>
          <h1 className='text-foreground text-2xl leading-snug font-semibold'>
            {name}
          </h1>

          {description && (
            <p className='text-muted-foreground line-clamp-2 text-sm'>
              {description}
            </p>
          )}

          {(validFrom || validTo) && (
            <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
              <CalendarDays className='h-3.5 w-3.5' />
              <span>
                {formatDate(validFrom)}
                {validTo ? ` – ${formatDate(validTo)}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats — chỉ hiện khi đã login và có data */}
      {stats && (
        <div className='grid grid-cols-3 gap-3'>
          <StatCard
            icon={<BookOpen className='h-4 w-4' />}
            value={stats.totalQuestions}
            label={tCommon('questions')}
            sub={`${stats.practicedQuestions} ${tCommon('practiced')}`}
            subClassName='text-emerald-600'
          />
          <StatCard
            icon={<Layers className='h-4 w-4' />}
            value={stats.totalTopics}
            label={tCommon('topics')}
            sub={`${stats.completedTopics} ${tCommon('completed')}`}
            subClassName='text-emerald-600'
          />
          <StatCard
            icon={<TrendingUp className='h-4 w-4' />}
            value={`${progressPct}%`}
            label={tCommon('progress')}
            sub={`${stats.practicedQuestions} / ${stats.totalQuestions} ${tCommon('questions')}`}
            subClassName='text-primary'
            progress={progressPct}
          />
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  icon?: React.ReactNode
  value: string | number
  label: string
  sub: string
  subClassName?: string
  progress?: number
}

function StatCard({
  icon,
  value,
  label,
  sub,
  subClassName,
  progress,
}: StatCardProps) {
  return (
    <div className='bg-muted/50 space-y-1 rounded-lg px-4 py-3'>
      <div className='flex items-center gap-1.5'>
        {icon && <span className='text-muted-foreground'>{icon}</span>}
        <span className='text-muted-foreground text-xs'>{label}</span>
      </div>
      <div className='text-foreground text-xl font-semibold'>{value}</div>
      <div className={cn('text-xs', subClassName ?? 'text-muted-foreground')}>
        {sub}
      </div>
      {progress !== undefined && (
        <div className='bg-muted mt-1 h-1.5 overflow-hidden rounded-full'>
          <div
            className='bg-primary h-full rounded-full transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

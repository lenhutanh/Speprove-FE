'use client'

import { Badge } from '@/components/ui/badge'
import { CalendarDays, BookOpen, Layers, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ForecastResType } from '@/types'
import { forecastThumbnail } from '@/assets'

interface ForecastInfoProps {
  forecast: ForecastResType
}

export default function ForecastInfo({ forecast }: ForecastInfoProps) {
  const {
    name,
    description,
    thumbnail,
    validFrom,
    validTo,
    isActive = true,
    stats,
  } = forecast

  const progressPct =
    stats && stats.totalQuestions > 0
      ? Math.round((stats.practicedQuestions / stats.totalQuestions) * 100)
      : 0

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      : null

  return (
    <div className="mb-8 space-y-4">
      {/* Thumbnail + Info */}
      <div className="flex items-start gap-5">
        {/* Thumbnail lớn bên trái */}
        <Image
          src={thumbnail || forecastThumbnail}
          alt={name}
          className="w-36 rounded-xl object-cover flex-shrink-0"
        />

        {/* Info bên phải */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <Badge
            variant="secondary"
            className={cn(
              'text-xs font-medium gap-1.5',
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                isActive ? 'bg-emerald-500' : 'bg-muted-foreground'
              )}
            />
            {isActive ? 'Đang hiệu lực' : 'Hết hạn'}
          </Badge>

          <h1 className="text-2xl font-semibold text-foreground leading-snug">
            {name}
          </h1>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}

          {(validFrom || validTo) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
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
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<BookOpen className="w-4 h-4" />}
            value={stats.totalQuestions}
            label="Câu hỏi"
            sub={`${stats.practicedQuestions} đã luyện`}
            subClassName="text-emerald-600"
          />
          <StatCard
            icon={<Layers className="w-4 h-4" />}
            value={stats.totalTopics}
            label="Topics"
            sub={`${stats.completedTopics} hoàn thành`}
            subClassName="text-emerald-600"
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            value={`${progressPct}%`}
            label="Tiến độ"
            sub={`${stats.practicedQuestions} / ${stats.totalQuestions} câu`}
            subClassName="text-primary"
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

function StatCard({ icon, value, label, sub, subClassName, progress }: StatCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg px-4 py-3 space-y-1">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-semibold text-foreground">{value}</div>
      <div className={cn('text-xs', subClassName ?? 'text-muted-foreground')}>{sub}</div>
      {progress !== undefined && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
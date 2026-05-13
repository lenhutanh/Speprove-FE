'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import route from '@/routes'
import { ChevronRight } from 'lucide-react'

interface CategoryCardProps {
  categoryLabel: string
  categoryValue: string
  forecastSlug: string
}

export default function CategoryCard({
  categoryLabel,
  categoryValue,
  forecastSlug,
}: CategoryCardProps) {
  return (
    <Link
      href={`${route.forecast}/${forecastSlug}/category/${categoryValue}`}
      className={cn(
        'group bg-card flex items-center justify-between gap-4 rounded-xl border p-4',
        'hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 hover:shadow-sm',
      )}
    >
      <div className='min-w-0 flex-1'>
        <h3 className='text-foreground group-hover:text-primary truncate text-sm font-semibold transition-colors'>
          {categoryLabel}
        </h3>
      </div>

      <div className='bg-muted group-hover:bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors'>
        <ChevronRight className='text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:translate-x-0.5' />
      </div>
    </Link>
  )
}

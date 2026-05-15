'use client'

import { cn } from '@/lib'
import './volume-loading.css'

type VolumeLoadingProps = {
  className?: string
  barClassName?: string
}

export default function VolumeLoading({
  className,
  barClassName,
}: VolumeLoadingProps) {
  return (
    <div className={cn('volume-loading', className)}>
      <span className={cn('volume-loading-bar', barClassName)} />
    </div>
  )
}

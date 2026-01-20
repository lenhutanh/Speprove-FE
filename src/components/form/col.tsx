import { cn } from '@/lib'
import { HTMLAttributes, PropsWithChildren } from 'react'

type ColProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  span?: number
  gutter?: number
}

export default function Col({
  children,
  className,
  span = 24,
  gutter = 8,
  ...rest
}: ColProps) {
  const width = gutter
    ? `calc(${(span * 100) / 24}% - ${gutter}px)`
    : `${(span * 100) / 24}%`

  return (
    <div style={{ width }} className={cn('flex flex-col', className)} {...rest}>
      {children}
    </div>
  )
}

'use client'

import { cn } from '@/lib'

export default function Container({
  children,
  className,
  contentClassName,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  contentClassName?: string
}) {
  return (
    <div className={cn('relative py-4', className)} {...props}>
      <div className={cn('content mx-auto w-full max-w-330', contentClassName)}>
        {children}
      </div>
    </div>
  )
}

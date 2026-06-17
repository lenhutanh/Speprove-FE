'use client'

import { cn } from '@/lib'

export type ContainerSize =
  | 'default'
  | 'narrow'
  | 'medium'
  | 'small'
  | 'form'
  | 'full'

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  contentClassName?: string
  size?: ContainerSize
}

const sizeClasses: Record<ContainerSize, string> = {
  default: 'max-w-330', // 1320px
  narrow: 'max-w-6xl', // 1152px
  medium: 'max-w-lg', // 512px
  small: 'max-w-3xl', // 768px
  form: 'max-w-md', // 448px
  full: 'max-w-full',
}

export default function Container({
  children,
  className,
  contentClassName,
  size = 'default',
  ...props
}: ContainerProps) {
  return (
    <div className={cn('relative w-full py-4', className)} {...props}>
      <div
        className={cn(
          'content mx-auto w-full px-4 sm:px-6 lg:px-8',
          sizeClasses[size],
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

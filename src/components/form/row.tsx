import { cn } from '@/lib'
import { HTMLAttributes, PropsWithChildren } from 'react'

type RowProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export default function Row({ children, className, ...rest }: RowProps) {
  return (
    <div
      className={cn('mb-7 flex w-full flex-wrap gap-x-4 gap-y-7', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

import { cn } from '@/lib'
import { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react'

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
  const style = {
    '--col-width': width,
  } as CSSProperties

  return (
    <div
      style={style}
      className={cn(
        'flex w-full min-w-0 flex-col sm:w-[var(--col-width)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

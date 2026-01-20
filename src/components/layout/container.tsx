'use client'

import { cn } from '@/lib'
// import { useAppLoadingStore } from '@/store/use-app-loading-store';

export default function Container({
  children,
  contentClassName,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  contentClassName?: string
}) {
  // const { loading } = useAppLoadingStore();
  return (
    <>
      <div className={cn('relative py-4', {})} {...props}>
        <div className={cn('content mx-auto max-w-[1320px]', contentClassName)}>
          {children}
        </div>
      </div>
      {/* <FullPageLoading show={loading} /> */}
    </>
  )
}

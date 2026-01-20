'use client'

import { cn } from '@/lib'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function FullPageLoading({
  show = false,
  className,
}: {
  show?: boolean
  className?: string
}) {
  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        suppressHydrationWarning
        initial={{ opacity: 1, visibility: 'visible' }}
        animate={{
          opacity: show ? 1 : 0,
          visibility: show ? 'visible' : 'hidden',
        }}
        exit={{ opacity: 0, visibility: 'hidden' }}
        transition={{ ease: 'linear', duration: 0.3 }}
        className={cn(
          'fixed inset-0 z-[9999] flex items-center justify-center bg-white/40',
          className,
        )}
      >
        <Loader2 className='text-green-primary h-10 w-10 animate-spin' />
      </motion.div>
    </AnimatePresence>
  )
}

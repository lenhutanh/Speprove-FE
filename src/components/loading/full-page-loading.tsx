'use client'

import { cn } from '@/lib'
import { AnimatePresence, motion } from 'framer-motion'
import VolumeLoading from './volume-loading'

export default function FullPageLoading({
  show = false,
  className,
}: {
  show?: boolean
  className?: string
}) {
  return (
    <AnimatePresence mode='wait' initial={false}>
      {show && (
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, visibility: 'hidden' }}
          animate={{
            opacity: 1,
            visibility: 'visible',
          }}
          exit={{
            opacity: 0,
            visibility: 'hidden',
          }}
          transition={{ ease: 'linear', duration: 0.3 }}
          className={cn(
            'fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 backdrop-blur-[2px]',
            className,
          )}
        >
          <VolumeLoading />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

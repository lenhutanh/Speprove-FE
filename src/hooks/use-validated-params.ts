'use client'

import { validateParams } from '@/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { z } from 'zod'

export default function useValidatedParams<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const validation = useMemo(
    () => validateParams(schema, searchParams),
    [schema, searchParams],
  )

  useEffect(() => {
    if (validation.invalidKeys.length === 0) return
    const cleaned = new URLSearchParams(searchParams.toString())
    validation.invalidKeys.forEach((key) => cleaned.delete(key as any))
    router.replace(
      cleaned.toString() ? `${pathname}?${cleaned.toString()}` : pathname,
      { scroll: false },
    )
  }, [pathname, router, validation])

  return validation.valid as z.infer<typeof schema>
}

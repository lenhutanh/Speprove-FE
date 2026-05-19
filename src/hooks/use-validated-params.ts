'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { validateParams } from '@/utils'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { z } from 'zod'

export default function useValidatedParams<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const validation = useMemo(() => {
    return validateParams(schema, searchParams)
  }, [schema, searchParams])

  const invalidKeysKey = validation.invalidKeys.join(',')

  useEffect(() => {
    if (validation.invalidKeys.length === 0) return

    const cleanedParams = new URLSearchParams(searchParams.toString())

    validation.invalidKeys.forEach((key) => {
      cleanedParams.delete(key)
    })

    const nextUrl = cleanedParams.toString()
      ? `${pathname}?${cleanedParams.toString()}`
      : pathname

    router.replace(nextUrl, { scroll: false })
  }, [pathname, router, searchParams, invalidKeysKey])

  return validation.valid as z.infer<z.ZodObject<T>>
}

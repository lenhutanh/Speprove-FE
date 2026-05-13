'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

const useQueryParams = <T extends Record<string, any>>() => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const paramsObj = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  )

  const createQueryString = useCallback(
    (newParams: Partial<T>, options?: { keepPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key)
        } else if (
          key === 'page' &&
          (Number(value) <= 1 || isNaN(Number(value)))
        ) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      if (
        !options?.keepPage &&
        !Object.prototype.hasOwnProperty.call(newParams, 'page')
      ) {
        params.delete('page')
      }

      return params.toString() ? `${pathname}?${params.toString()}` : pathname
    },
    [pathname, searchParams],
  )

  const setQueryParams = useCallback(
    (
      newParams: Partial<T>,
      options?: { replace?: boolean; keepPage?: boolean },
    ) => {
      const url = createQueryString(newParams, options)
      if (options?.replace) {
        router.replace(url, { scroll: false })
      } else {
        router.push(url, { scroll: false })
      }
    },
    [createQueryString, router],
  )

  return { paramsObj, setQueryParams, createQueryString }
}

export default useQueryParams

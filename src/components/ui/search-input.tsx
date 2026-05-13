'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQueryParams } from '@/hooks'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

interface SearchInputProps {
  paramKey?: string
  placeholder?: string
  className?: string
  debounce?: number
  onChange?: (value: string) => void
}

export default function SearchInput({
  paramKey = 'search',
  placeholder,
  className,
  debounce = 500,
  onChange,
}: SearchInputProps) {
  const t = useTranslations('common')
  const { paramsObj, setQueryParams } = useQueryParams()

  const [value, setValue] = useState<string>(
    (paramsObj[paramKey] as string) ?? '',
  )

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const finalPlaceholder = placeholder || t('search')

  useEffect(() => {
    const urlValue = (paramsObj[paramKey] as string) ?? ''
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue((prev) => (prev !== urlValue ? urlValue : prev))
  }, [paramsObj, paramKey])

  const commit = (val: string) => {
    setQueryParams({ [paramKey]: val || null }, { replace: true })
    onChange?.(val)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => commit(val), debounce)
  }

  const handleClear = () => {
    setValue('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    commit('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      commit(value)
    }
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        className='text-muted-foreground pointer-events-none absolute left-3 size-4'
        aria-hidden
      />
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={finalPlaceholder}
        className='pr-9 pl-9'
        aria-label={finalPlaceholder}
      />
      {value && (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='text-muted-foreground hover:text-foreground absolute right-1 size-7'
          onClick={handleClear}
          aria-label={t('clear_search')}
        >
          <X className='size-3.5' />
        </Button>
      )}
    </div>
  )
}

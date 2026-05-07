'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQueryParams } from '@/hooks'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface SelectOption {
  label: string
  value: string
}

interface SelectInputProps {
  paramKey: string
  options: SelectOption[]
  placeholder?: string
  className?: string
  onChange?: (value: string) => void
  clearable?: boolean
  clearLabel?: string
}

export default function SelectInput({
  paramKey,
  options,
  placeholder = 'Chọn...',
  className,
  onChange,
}: SelectInputProps) {
  const { paramsObj, setQueryParams } = useQueryParams()

  const [value, setValue] = useState<string>(
    (paramsObj[paramKey] as string) ?? '',
  )

  useEffect(() => {
    const urlValue = (paramsObj[paramKey] as string) ?? ''
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue((prev) => (prev !== urlValue ? urlValue : prev))
  }, [paramsObj, paramKey])

  const handleChange = (val: string) => {
    const next = val === value ? '' : val
    setValue(next)
    setQueryParams({ [paramKey]: next || null }, { replace: true })
    onChange?.(next)
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className={cn('w-36', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

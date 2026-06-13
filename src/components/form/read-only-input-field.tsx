'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { HTMLInputTypeAttribute, ReactNode } from 'react'

type ReadOnlyInputFieldProps = {
  label?: string
  value?: string | number | null
  placeholder?: string
  description?: string
  type?: HTMLInputTypeAttribute
  className?: string
  formItemClassName?: string
  labelClassName?: string
  disabled?: boolean
  prefixIcon?: ReactNode
  suffixIcon?: ReactNode
}

export default function ReadOnlyInputField({
  label,
  value,
  placeholder,
  description,
  type = 'text',
  className,
  formItemClassName,
  labelClassName,
  disabled = false,
  prefixIcon,
  suffixIcon,
}: ReadOnlyInputFieldProps) {
  return (
    <div
      className={cn(
        'grid gap-2',
        { 'cursor-not-allowed opacity-50': disabled },
        formItemClassName,
      )}
    >
      {label && (
        <Label className={cn('ml-1 gap-1.5', labelClassName)}>{label}</Label>
      )}

      <div className='relative'>
        {prefixIcon && (
          <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
            {prefixIcon}
          </div>
        )}
        <Input
          value={value ?? ''}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          readOnly
          className={cn(
            className,
            'placeholder:text-muted-foreground pt-0! pb-[0.5px] font-normal focus-visible:border-transparent focus-visible:ring-[2px]',
            {
              'pl-10': prefixIcon,
              'pr-10': suffixIcon,
              'cursor-not-allowed opacity-50': disabled,
            },
            'focus-visible:ring-green-primary focus-visible:border-transparent',
          )}
        />
        {suffixIcon && (
          <div className='text-muted-foreground absolute top-0 right-0 h-full'>
            {suffixIcon}
          </div>
        )}
      </div>

      {description && (
        <p className='text-muted-foreground text-sm'>{description}</p>
      )}
    </div>
  )
}

'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { HTMLInputTypeAttribute, ReactNode } from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  description?: string
  type?: HTMLInputTypeAttribute
  className?: string
  formItemClassName?: string
  required?: boolean
  labelClassName?: string
  disabled?: boolean
  readOnly?: boolean
  prefixIcon?: ReactNode
  suffixIcon?: ReactNode
}

export default function InputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  className,
  formItemClassName,
  required,
  labelClassName,
  disabled,
  readOnly = false,
  prefixIcon,
  suffixIcon,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            { 'cursor-not-allowed opacity-50': disabled },
            formItemClassName,
          )}
        >
          {label && (
            <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
              {label}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className='relative'>
              {prefixIcon && (
                <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                  {prefixIcon}
                </div>
              )}
              <Input
                placeholder={placeholder}
                type={type}
                disabled={disabled}
                readOnly={readOnly}
                {...field}
                className={cn(
                  className,
                  'pt-0! pb-[0.5px] font-normal placeholder:text-gray-300 focus-visible:border-transparent focus-visible:ring-[2px]',
                  {
                    'pl-10': prefixIcon,
                    'pr-10': suffixIcon,
                    'cursor-not-allowed opacity-50': disabled,
                    'border-red-500 focus-visible:border-red-500 focus-visible:ring-[1px] focus-visible:ring-red-500':
                      fieldState.error,
                  },
                  !fieldState.error &&
                    'focus-visible:ring-green-primary focus-visible:border-transparent',
                )}
              />
              {suffixIcon && (
                <div className='text-muted-foreground absolute top-0 right-0 h-full'>
                  {suffixIcon}
                </div>
              )}
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          {fieldState.error && (
            <div className='animate-in fade-in -bottom-6 left-2 z-0 mt-1 text-sm text-red-500 duration-200'>
              <FormMessage />
            </div>
          )}
        </FormItem>
      )}
    />
  )
}

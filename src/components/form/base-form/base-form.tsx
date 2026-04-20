// 'use client'

// import { Form } from '@/components/ui/form'
// import { cn } from '@/lib'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useEffect } from 'react'
// import { DefaultValues, useForm, UseFormReturn } from 'react-hook-form'

// type AsyncDefaultValues<T> = (payload?: unknown) => Promise<T>

// type BaseFormProps<T extends Record<string, any>> = {
//   schema: any
//   defaultValues: DefaultValues<T> | AsyncDefaultValues<T>
//   onSubmit: (values: T, form: UseFormReturn<T>) => Promise<void> | void
//   children?: (methods: UseFormReturn<T>) => React.ReactNode
//   className?: string
//   initialValues?: T
//   mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all' | undefined
//   onChange?: () => void
// }

// export default function BaseForm<T extends Record<string, any>>({
//   schema,
//   defaultValues,
//   onSubmit,
//   children,
//   className,
//   initialValues,
//   mode = 'onChange',
//   onChange,
// }: BaseFormProps<T>) {
//   const form = useForm<T>({
//     resolver: zodResolver(schema),
//     defaultValues,
//     mode,
//   })

//   useEffect(() => {
//     if (initialValues) {
//       form.reset(initialValues)
//     }
//   }, [initialValues, form])

//   return (
//     <Form {...form}>
//       <form
//         className={cn('relative bg-white', className)}
//         onSubmit={form.handleSubmit((values) => onSubmit(values, form))}
//         onChange={onChange}
//       >
//         {children?.(form)}
//       </form>
//     </Form>
//   )
// }
'use client'

import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils' // Đảm bảo import đúng đường dẫn
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { DefaultValues, useForm, UseFormReturn } from 'react-hook-form'

// Định nghĩa cấu trúc chung của API Response
export type FormApiResponse = {
  success: boolean
  message?: string
  errors?: Record<string, string>
  [key: string]: any // Cho phép chứa các trường khác như data
}

type AsyncDefaultValues<T> = (payload?: unknown) => Promise<T>

type BaseFormProps<T extends Record<string, any>> = {
  schema: any
  defaultValues: DefaultValues<T> | AsyncDefaultValues<T>
  // Thay đổi ở đây: Bắt buộc onSubmit phải trả về FormApiResponse hoặc void
  onSubmit: (
    values: T,
    form: UseFormReturn<T>,
  ) => Promise<FormApiResponse | void> | FormApiResponse | void
  children?: (methods: UseFormReturn<T>) => React.ReactNode
  className?: string
  initialValues?: T
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all' | undefined
  onChange?: () => void
}

export default function BaseForm<T extends Record<string, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  initialValues,
  mode = 'onChange',
  onChange,
}: BaseFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  })

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues)
    }
  }, [initialValues, form])

  // Hàm trung gian xử lý submit và tự động map lỗi
  const handleFormSubmit = async (values: T) => {
    try {
      // 1. Chờ hàm onSubmit từ component cha (ví dụ: LoginPage) thực thi
      const res = await onSubmit(values, form)

      // 2. Nếu component cha có trả về kết quả API, ta bắt đầu kiểm tra
      if (res && !res.success) {
        // Nếu có object errors từ BE, tự động map vào các input
        if (res.errors && Object.keys(res.errors).length > 0) {
          Object.entries(res.errors).forEach(([key, message]) => {
            form.setError(key as any, {
              type: 'server',
              message: message as string,
            })
          })
        }
      }
    } catch (error) {
      console.error('Lỗi khi submit form:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('relative bg-white', className)}
        onSubmit={form.handleSubmit(handleFormSubmit)} // Thay đổi ở đây
        onChange={onChange}
      >
        {children?.(form)}
      </form>
    </Form>
  )
}

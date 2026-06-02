'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useMobile } from '@/hooks'
import { cn } from '@/lib/utils'
import { Eye, Loader2, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

type UploadAvatarResult = {
  id: string
  url: string
}

type ProfileAvatarFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  currentImageUrl?: string | null
  fallback?: string
  disabled?: boolean
  required?: boolean
  className?: string
  avatarClassName?: string

  /**
   * Hàm upload thật từ bên ngoài truyền vào.
   * Component này không tự biết API của bạn.
   */
  uploadAvatar: (file: File) => Promise<UploadAvatarResult>

  /**
   * Optional: callback khi upload xong.
   * Dùng nếu page cha muốn lưu thêm previewUrl, toast, invalidate query...
   */
  onUploaded?: (file: UploadAvatarResult) => void

  /**
   * Optional: callback khi remove.
   */
  onRemoved?: () => void
}

export default function ProfileAvatarField<T extends FieldValues>({
  control,
  name,
  label,
  currentImageUrl,
  fallback,
  disabled = false,
  required = false,
  className,
  avatarClassName,
  uploadAvatar,
  onUploaded,
  onRemoved,
}: ProfileAvatarFieldProps<T>) {
  const isMobile = useMobile()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl ?? null,
  )
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openViewImage, setOpenViewImage] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(currentImageUrl ?? null)
  }, [currentImageUrl])

  const openFilePicker = () => {
    if (disabled || isUploading) return

    setOpenDrawer(false)

    // Delay nhẹ để Drawer đóng trước rồi mới mở file picker trên mobile
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 100)
  }

  const handleViewAvatar = () => {
    if (!previewUrl) return

    setOpenDrawer(false)
    setOpenViewImage(true)
  }

  const AvatarButton = (
    <button
      type='button'
      disabled={disabled}
      className={cn(
        'group relative rounded-full outline-none',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <Avatar
        className={cn(
          'h-40 w-40 border shadow-sm',
          !disabled && 'cursor-pointer',
          avatarClassName,
        )}
      >
        <AvatarImage src={previewUrl ?? undefined} />
        <AvatarFallback className='text-6xl font-medium'>
          {fallback}
        </AvatarFallback>
      </Avatar>

      {isUploading && (
        <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/45'>
          <Loader2 className='text-primary-foreground h-6 w-6 animate-spin' />
        </div>
      )}
    </button>
  )

  const renderActions = (onChange: (value: string | null) => void) => (
    <>
      {previewUrl && (
        <Button
          type='button'
          variant='ghost'
          className='w-full justify-start gap-2'
          disabled={!previewUrl}
          onClick={handleViewAvatar}
        >
          <Eye className='h-4 w-4' />
          Xem ảnh đại diện
        </Button>
      )}

      <Button
        type='button'
        variant='ghost'
        className='w-full justify-start gap-2'
        disabled={disabled || isUploading}
        onClick={openFilePicker}
      >
        <Upload className='h-4 w-4' />
        Chọn ảnh đại diện
      </Button>

      {previewUrl && (
        <Button
          type='button'
          variant='ghost'
          className='text-destructive hover:text-destructive w-full justify-start gap-2'
          disabled={disabled || !previewUrl}
          onClick={() => {
            setOpenDrawer(false)
            setPreviewUrl(null)
            onChange(null)
            onRemoved?.()
          }}
        >
          <Trash2 className='h-4 w-4' />
          Xoá ảnh đại diện
        </Button>
      )}
    </>
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-3', className)}>
          {label && (
            <FormLabel className='ml-1 gap-1.5'>
              {label}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}

          <FormControl>
            <div className='flex flex-col items-start gap-3'>
              {isMobile ? (
                <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
                  <DrawerTrigger asChild>{AvatarButton}</DrawerTrigger>

                  <DrawerContent>
                    <div className='space-y-2 p-4'>
                      {renderActions(field.onChange)}

                      <Button
                        type='button'
                        variant='outline'
                        className='mt-2 w-full'
                        onClick={() => setOpenDrawer(false)}
                      >
                        Huỷ
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {AvatarButton}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align='center' className='w-56'>
                    {previewUrl && (
                      <DropdownMenuItem
                        disabled={!previewUrl}
                        onClick={handleViewAvatar}
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        Xem ảnh đại diện
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      disabled={disabled || isUploading}
                      onClick={openFilePicker}
                    >
                      <Upload className='mr-2 h-4 w-4' />
                      Chọn ảnh đại diện
                    </DropdownMenuItem>

                    {previewUrl && (
                      <DropdownMenuItem
                        disabled={disabled || !previewUrl}
                        className='text-destructive focus:text-destructive'
                        onClick={() => {
                          setPreviewUrl(null)
                          field.onChange(null)
                          onRemoved?.()
                        }}
                      >
                        <Trash2 className='text-destructive mr-2 h-4 w-4' />
                        Xoá ảnh đại diện
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                hidden
                disabled={disabled || isUploading}
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (!file) return

                  try {
                    setIsUploading(true)

                    const uploadedFile = await uploadAvatar(file)
                    field.onChange(uploadedFile.id)
                    setPreviewUrl(uploadedFile.url)
                    onUploaded?.(uploadedFile)
                  } finally {
                    setIsUploading(false)

                    event.target.value = ''
                  }
                }}
              />
            </div>
          </FormControl>

          <FormMessage />

          <Dialog open={openViewImage} onOpenChange={setOpenViewImage}>
            <DialogContent className='max-w-md' showCloseButton={false}>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt='Ảnh đại diện'
                  className='max-h-[70vh] w-full rounded-lg object-contain'
                />
              )}
            </DialogContent>
          </Dialog>
        </FormItem>
      )}
    />
  )
}

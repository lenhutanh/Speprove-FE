import {
  ALLOWED_AUDIO_EXTENSIONS,
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_TYPES,
  AUDIO_PURPOSE,
  IMAGE_PURPOSE,
  LIMIT_AUDIO_SIZE,
  LIMIT_IMAGE_SIZE,
} from '@/constants'
import { validateAudioFile } from '@/utils'
import z from 'zod'

export const uploadAudioSchema = z.object({
  purpose: z.nativeEnum(AUDIO_PURPOSE, {
    message: 'Mục đích upload không hợp lệ',
  }),

  audio: z
    .instanceof(File, { message: 'Vui lòng cung cấp file âm thanh' })
    .superRefine((file, ctx) => {
      const result = validateAudioFile(
        file,
        LIMIT_AUDIO_SIZE,
        ALLOWED_AUDIO_EXTENSIONS,
        ALLOWED_AUDIO_TYPES,
      )
      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: [],
        })
      }
    }),
})

export const uploadImageSchema = z.object({
  purpose: z.nativeEnum(IMAGE_PURPOSE, {
    message: 'Mục đích upload không hợp lệ',
  }),

  image: z
    .instanceof(File, { message: 'Vui lòng cung cấp file hình ảnh' })
    .superRefine((file, ctx) => {
      const result = validateAudioFile(
        file,
        LIMIT_IMAGE_SIZE,
        ALLOWED_IMAGE_EXTENSIONS,
        ALLOWED_IMAGE_TYPES,
      )
      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: [],
        })
      }
    }),
})

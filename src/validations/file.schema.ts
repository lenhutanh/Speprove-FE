import { AUDIO_PURPOSE } from '@/constants'
import { validateAudioFile } from '@/utils'
import z from 'zod'

export const uploadAudioSchema = z.object({
  purpose: z.nativeEnum(AUDIO_PURPOSE, {
    message: 'Mục đích upload không hợp lệ',
  }),

  audio: z
    .instanceof(File, { message: 'Vui lòng cung cấp file âm thanh' })
    .superRefine((file, ctx) => {
      const result = validateAudioFile(file)
      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: [],
        })
      }
    }),
})

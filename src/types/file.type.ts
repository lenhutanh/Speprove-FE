import { FILE_KIND } from '@/constants'
import { uploadAudioSchema, uploadImageSchema } from '@/validations/file.schema'
import z from 'zod'

export type UploadAudioBodyType = z.infer<typeof uploadAudioSchema>
export type UploadImageBodyType = z.infer<typeof uploadImageSchema>

type BaseFile = {
  id: string
  url: string
  fileName: string
  fileSize?: number
  mimeType: string
  createdAt: string
}

export type AudioFileResponse = BaseFile & {
  kind: typeof FILE_KIND.AUDIO
  duration?: number
  transcript?: string
}

export type ImageFileResponse = BaseFile & {
  kind: typeof FILE_KIND.IMAGE
  width?: number
  height?: number
}

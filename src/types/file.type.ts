import { FILE_KIND } from '@/constants'
import { uploadAudioSchema } from '@/validations/file.schema'
import z from 'zod'

export type UploadAudioBodyType = z.infer<typeof uploadAudioSchema>

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

export type FileResponseDto = AudioFileResponse | ImageFileResponse

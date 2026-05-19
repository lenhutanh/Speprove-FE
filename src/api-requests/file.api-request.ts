import { apiConfig } from '@/constants'
import { ApiResponse, AudioFileResponse, ImageFileResponse } from '@/types'
import { http } from '@/utils'

const fileApiRequest = {
  uploadAudio: (body: FormData) =>
    http.post<ApiResponse<AudioFileResponse>>(apiConfig.file.uploadAudio, {
      body,
    }),
  uploadImage: (body: FormData) =>
    http.post<ApiResponse<ImageFileResponse>>(apiConfig.file.uploadImage, {
      body,
    }),
}

export default fileApiRequest

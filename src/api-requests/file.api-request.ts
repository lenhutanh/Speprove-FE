import { apiConfig } from '@/constants'
import { ApiResponse, FileResponseDto } from '@/types'
import { http } from '@/utils'

const fileApiRequest = {
  uploadAudio: (body: FormData) =>
    http.post<ApiResponse<FileResponseDto>>(apiConfig.file.uploadAudio, {
      body,
    }),
}

export default fileApiRequest

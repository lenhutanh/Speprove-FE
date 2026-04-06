import fileApiRequest from '@/api-requests/file.api-request'
import { UploadAudioBodyType } from '@/types'
import { useMutation } from '@tanstack/react-query'

export const useUploadAudioMutation = () => {
  return useMutation({
    mutationKey: ['upload-audio'],
    mutationFn: (payload: UploadAudioBodyType) => {
      const formData = new FormData()
      formData.append('audio', payload.audio)
      formData.append('purpose', payload.purpose)
      return fileApiRequest.uploadAudio(formData)
    },
  })
}

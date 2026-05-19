import fileApiRequest from '@/api-requests/file.api-request'
import { UploadAudioBodyType, UploadImageBodyType } from '@/types'
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

export const useUploadImageMutation = () => {
  return useMutation({
    mutationKey: ['upload-image'],
    mutationFn: (payload: UploadImageBodyType) => {
      const formData = new FormData()
      formData.append('image', payload.image)
      formData.append('purpose', payload.purpose)
      return fileApiRequest.uploadImage(formData)
    },
  })
}

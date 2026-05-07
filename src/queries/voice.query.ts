import { voiceApiRequest } from '@/api-requests'
import { useQuery } from '@tanstack/react-query'

export const useDefaultVoiceQuery = () => {
  return useQuery({
    queryKey: ['default-query'],
    queryFn: () => voiceApiRequest.getDefault(),
  })
}

export const useVoiceListQuery = () => {
  return useQuery({
    queryKey: ['voices'],
    queryFn: () => voiceApiRequest.getList(),
    enabled: true,
  })
}

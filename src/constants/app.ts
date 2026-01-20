import envConfig from '@/envConfig'

const apiUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT_URL

const AppConstants = {
  apiUrl: `${apiUrl}/api/`,
}

export default AppConstants

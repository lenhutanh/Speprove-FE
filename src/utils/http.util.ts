import { ErrorCodes } from '@/constants'
import envConfig from '@/envConfig'
import { useAuthStore } from '@/store'
import { ApiConfig, Payload } from '@/types/api.type'

// Chỉ quản lý trạng thái đang refresh hay không (true/false) thay vì giữ string token
let refreshTokenPromise: Promise<boolean> | null = null

const isClient = () => typeof window !== 'undefined'

const sendRequest = async <T>(
  apiConfig: ApiConfig,
  payload: Payload = {},
  isRetry = false,
): Promise<T> => {
  let { baseUrl, method, ignoreAuth, isUpload, headers } = apiConfig
  const { params = {}, pathParams = {}, body = {}, options = {} } = payload

  const baseHeader: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Thay thế Path Params
  Object.entries(pathParams).forEach(([key, value]) => {
    baseUrl = baseUrl.replace(`:${key}`, String(value))
  })

  // Build Query Params
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null && v !== ''),
  )
  const queryParams = new URLSearchParams(filteredParams).toString()
  const fullUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl

  const fetchOptions: RequestInit = {
    method,
    headers: baseHeader,
    // credentials: 'include' cực kỳ quan trọng:
    // Trình duyệt sẽ tự đính kèm accessToken từ Cookie vào mọi request
    credentials: 'include',
    ...options,
  }

  if (isUpload && body instanceof FormData) {
    delete (baseHeader as any)['Content-Type']
    fetchOptions.body = body
  } else if (method !== 'GET' && body) {
    fetchOptions.body = JSON.stringify(body)
  }

  const response = await fetch(fullUrl, fetchOptions)

  if (!response.ok) {
    const errorRes = await response.json().catch(() => ({}))

    // 1. Xử lý 401: Token không tồn tại hoặc hoàn toàn không hợp lệ
    if (
      response.status === 401 &&
      (errorRes.errorCode === ErrorCodes.SESSION_EXPIRED ||
        errorRes.errorCode === ErrorCodes.INVALID_TOKEN ||
        errorRes.errorCode === ErrorCodes.TOKEN_MISSING)
    ) {
      if (isClient()) useAuthStore.getState().logout()
      throw errorRes
    }

    // 2. Xử lý 410: Access Token hết hạn nhưng có thể refresh
    if (
      response.status === 401 &&
      !isRetry &&
      !ignoreAuth &&
      errorRes.errorCode === ErrorCodes.TOKEN_EXPIRED
    ) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = (async () => {
          try {
            const res = await fetch(
              `${envConfig.NEXT_PUBLIC_API_ENDPOINT_URL}/auth/refresh`,
              {
                method: 'POST',
                credentials: 'include',
              },
            )
            if (!res.ok) throw new Error('Refresh failed')
            return true
          } catch (error) {
            if (isClient()) useAuthStore.getState().logout()
            return false
          } finally {
            refreshTokenPromise = null
          }
        })()
      }

      const success = await refreshTokenPromise
      if (success) {
        return sendRequest<T>(apiConfig, payload, true)
      } else {
        throw errorRes
      }
    }

    return errorRes
  }

  return response.json() as Promise<T>
  // const response = await fetch(fullUrl, fetchOptions)
  // console.log('🚀 ~ sendRequest ~ response:', response)

  // // 1. Xử lý 401: Token không tồn tại hoặc hoàn toàn không hợp lệ
  // if (response.status === 401) {
  //   if (isClient()) useAuthStore.getState().logout()
  //   throw new Error('Unauthorized')
  // }

  // // 2. Xử lý 410: Access Token hết hạn nhưng có thể refresh
  // if (response.status === 410 && !isRetry && !ignoreAuth) {
  //   if (!refreshTokenPromise) {
  //     refreshTokenPromise = (async () => {
  //       try {
  //         const res = await fetch(
  //           `${envConfig.NEXT_PUBLIC_API_ENDPOINT_URL}/auth/refresh`,
  //           {
  //             method: 'POST',
  //             credentials: 'include',
  //           },
  //         )
  //         if (!res.ok) throw new Error('Refresh failed')
  //         return true
  //       } catch (error) {
  //         if (isClient()) useAuthStore.getState().logout()
  //         return false
  //       } finally {
  //         refreshTokenPromise = null
  //       }
  //     })()
  //   }

  //   const success = await refreshTokenPromise
  //   if (success) {
  //     return sendRequest<T>(apiConfig, payload, true)
  //   }
  // }

  // if (!response.ok) {
  //   const errorRes = await response.json().catch(() => ({}))
  //   throw { status: response.status, ...errorRes }
  // }

  return response.json() as Promise<T>
}

export const http = {
  get: <T>(config: ApiConfig, payload?: Payload) =>
    sendRequest<T>(config, payload),
  post: <T>(config: ApiConfig, payload?: Payload) =>
    sendRequest<T>(config, payload),
  put: <T>(config: ApiConfig, payload?: Payload) =>
    sendRequest<T>(config, payload),
  delete: <T>(config: ApiConfig, payload?: Payload) =>
    sendRequest<T>(config, payload),
}

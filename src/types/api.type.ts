export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type ApiConfig = {
  baseUrl: string
  headers?: Record<string, string>
  method: HttpMethod
  permissionCode?: string
  isRequiredTenantId?: boolean
  ignoreAuth?: boolean
  isUpload?: boolean
}

export type ApiConfigGroup = {
  [key: string]: ApiConfig | ApiConfigGroup | string
}

export type Payload = {
  params?: Record<string, any>
  pathParams?: Record<string, string | number>
  body?: any
  options?: RequestInit
}

export type ApiResponse<T> = {
  data?: T
  message?: string
  success?: boolean
  meta?: any
}

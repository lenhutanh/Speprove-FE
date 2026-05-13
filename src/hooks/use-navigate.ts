'use client'
import { useRouter } from '@/i18n/navigation'
import { useTopLoader } from 'nextjs-toploader'

interface NavigateOptions {
  replace?: boolean
  scroll?: boolean
}

const useNavigate = (startLoader: boolean = true) => {
  const router = useRouter()
  const loading = useTopLoader()

  const navigate = (path: string, options?: NavigateOptions) => {
    if (startLoader) loading.start()

    const method = options?.replace ? 'replace' : 'push'

    router[method](path, {
      scroll: options?.scroll ?? true,
    })
  }

  return navigate
}

export default useNavigate

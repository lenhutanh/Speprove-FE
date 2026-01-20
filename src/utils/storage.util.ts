const isBrowser = () => typeof window !== 'undefined'

export const setData = (key: string, value: string): void => {
  if (isBrowser()) {
    localStorage.setItem(key, value)
  }
}

export const getData = (key: string): string | null => {
  return isBrowser() ? localStorage.getItem(key) : null
}

export const removeData = (key: string): void => {
  if (isBrowser()) {
    localStorage.removeItem(key)
  }
}

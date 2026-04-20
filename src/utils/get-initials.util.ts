export function getInitials(name?: string): string {
  if (!name) return '?'

  let str = name.trim()

  if (str.includes('@')) {
    str = str.split('@')[0]
  }

  str = str.replace(/[^a-zA-ZÀ-ỹ\s]/g, '')

  const words = str.split(/\s+/).filter(Boolean)

  if (words.length === 0) return '?'

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  const first = words[0][0]
  const last = words[words.length - 1][0]

  return (first + last).toUpperCase()
}

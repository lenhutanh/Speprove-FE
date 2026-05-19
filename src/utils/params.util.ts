import { z } from 'zod'

export const validateParams = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  searchParams: URLSearchParams,
) => {
  const paramsObj = Object.fromEntries(searchParams.entries())

  const parsed = schema.strict().safeParse(paramsObj)

  if (parsed.success) {
    return {
      valid: parsed.data,
      invalidKeys: [],
    }
  }

  const invalidKeys = parsed.error.issues.flatMap((issue) => {
    if (issue.code === 'unrecognized_keys') {
      return issue.keys
    }

    const key = issue.path[0]
    return key ? [String(key)] : []
  })

  const cleanedObj = { ...paramsObj }

  invalidKeys.forEach((key) => {
    delete cleanedObj[key]
  })

  const cleanedParsed = schema.parse(cleanedObj)

  return {
    valid: cleanedParsed,
    invalidKeys,
  }
}

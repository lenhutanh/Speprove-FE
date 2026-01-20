import { z } from 'zod'

export const validateParams = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  searchParams: URLSearchParams,
) => {
  const paramsObj = Object.fromEntries(searchParams.entries())
  const parsed = schema.strict().safeParse(paramsObj)
  if (parsed.success) return { valid: parsed.data, invalidKeys: [] }
  const invalidKeys = parsed.error.issues.map((issue) => {
    if (issue.code === 'unrecognized_keys') {
      return issue.keys
    }
    return String(issue.path[0])
  })
  return { valid: schema.partial().parse({}), invalidKeys }
}

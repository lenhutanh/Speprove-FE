import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  NEXT_PUBLIC_API_ENDPOINT_URL: z.string().url().optional(),

  NEXT_PUBLIC_URL: z.string().url().optional(),

  // NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK: z.string().optional(),
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_API_ENDPOINT_URL: process.env.NEXT_PUBLIC_API_ENDPOINT_URL,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  // NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK: process.env.NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK,
})

if (!configProject.success) {
  console.error(
    'Invalid environment variables:',
    configProject.error.flatten().fieldErrors,
  )
  throw new Error('Các khai báo biến môi trường không hợp lệ')
}

const envConfig = configProject.data
export default envConfig

export type EnvConfig = z.infer<typeof configSchema>

import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgresql://'),
  APPLICATION_PORT: z.coerce.number().optional(),
})

export const env = envSchema.parse(Bun.env)

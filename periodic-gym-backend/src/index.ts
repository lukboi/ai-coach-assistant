import { env } from 'bun'
import { app } from './http/app'

app.listen(env.APPLICATION_PORT ?? 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)

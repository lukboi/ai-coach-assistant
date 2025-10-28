import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import z from 'zod'
import { betterAuthPlugin, OpenAPI } from './plugins/better-auth'
import { getProfile } from './routes/get-profile'
import { changeProfile } from './routes/change-profile'
import { createProfile } from './routes/create-profile'

export const app = new Elysia()
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .use(betterAuthPlugin)
  .use(getProfile)
  .use(changeProfile)
  .use(createProfile)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status

        return error.toResponse()
      }
      case 'NOT_FOUND': {
        return new Response(null, { status: 404 })
      }
      default: {
        console.error(error)

        return new Response(null, { status: 500 })
      }
    }
  })

export default app

import { Elysia } from 'elysia'
import BaseException from '../errors/base-exception'
import { withAuth } from '../plugins/better-auth'
import getById from '../services/user/get-by-id'
import {
  CreateProfileBodySchema,
  CreateProfileParamsSchema,
  CreateProfileResponseSchema,
} from './schemas/user/create-profile'
import createProfileById from '../services/user/create-profile-by-id'

export const createProfile = new Elysia().use(withAuth()).post(
  '/profile/:id/create',
  async ({ params, body }) => {
    const { profile } = await getById(params.id)

    if (profile) {
      throw new BaseException({
        code: 'BAD_REQUEST',
        message: 'Profile already exists',
        statusCode: 400,
      })
    }

    const createdProfile = await createProfileById({
      userId: params.id,
      ...body,
    })
    return createdProfile
  },
  {
    auth: true,
    params: CreateProfileParamsSchema,
    body: CreateProfileBodySchema,
    response: CreateProfileResponseSchema,
    detail: {
      summary: 'Create Profile',
      description: 'Create the profile of user',
      tags: ['User'],
    },
  },
)

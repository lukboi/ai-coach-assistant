import { Elysia } from 'elysia'
import BaseException from '../errors/base-exception'
import changeProfileById from '../services/user/change-profile-by-id'
import {
  ChangeProfileBodySchema,
  ChangeProfileParamsSchema,
  ChangeProfileResponseSchema,
} from './schemas/user/change-profile'
import { withAuth } from '../plugins/better-auth'
import getById from '../services/user/get-by-id'

export const changeProfile = new Elysia().use(withAuth()).patch(
  '/profile/:id/change',
  async ({ user, params, body }) => {
    const { profile } = await getById(user.id)
    if (user.id !== params.id && (!profile || profile.role !== 'ADMIN')) {
      throw new BaseException({
        code: 'FORBIDDEN',
        message: 'Você não tem permissão para editar este perfil',
        statusCode: 403,
      })
    }

    const updatedProfile = await changeProfileById({
      userId: params.id,
      ...body,
    })
    return updatedProfile
  },
  {
    auth: true,
    params: ChangeProfileParamsSchema,
    body: ChangeProfileBodySchema,
    response: ChangeProfileResponseSchema,
    detail: {
      summary: 'Change Profile',
      description: 'Change the profile of user',
      tags: ['User'],
    },
  },
)

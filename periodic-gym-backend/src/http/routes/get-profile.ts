import { Elysia } from 'elysia'
import { withAuth } from '../plugins/better-auth'
import getById from '../services/user/get-by-id'
import { UserProfile, UserProfileSchema } from './schemas/user/user-profile'

export const getProfile = new Elysia().use(withAuth()).get(
  '/me',
  async ({ user }): Promise<UserProfile> => {
    const result = await getById(user.id)

    return {
      user: {
        ...result.user,
        createdAt: result.user.createdAt.toISOString(),
        updatedAt: result.user.updatedAt.toISOString(),
      },
      profile: result.profile
        ? {
            ...result.profile,
            updatedAt: result.profile.updatedAt.toISOString(),
          }
        : null,
    }
  },
  {
    auth: true,
    response: UserProfileSchema,
    description: 'Get the profile of the authenticated user',
    detail: {
      summary: 'Get Profile',
      description: 'Get the profile of the authenticated user',
      tags: ['User'],
    },
  },
)

import { db } from '@/database/client'
import { eq } from 'drizzle-orm'
import { users } from '@/database/schema/users'
import { profiles } from '@/database/schema/profiles'
import DrizzleException from '@/http/errors/drizzle-exception'
import UserNotFoundException from '@/http/errors/user-not-found'

export default async function getById(userId: string) {
  const [result] = await db
    .selectDistinct()
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, userId))
    .catch(err => {
      throw new DrizzleException('selectDistinct', err)
    })

  if (!result) {
    throw new UserNotFoundException(userId)
  }
  const { users: userData, profiles: profileData } = result

  return { user: userData, profile: profileData }
}

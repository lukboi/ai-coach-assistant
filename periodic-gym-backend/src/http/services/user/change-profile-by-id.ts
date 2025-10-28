import { eq } from 'drizzle-orm'
import { db } from '../../../database/client'
import { profiles } from '../../../database/schema/profiles'
import DrizzleException from '@/http/errors/drizzle-exception'
import UserNotFoundException from '@/http/errors/user-not-found'

type UpdateProfileInput = {
  userId: string
  weight?: string
  height?: string
  mainObjective?:
    | 'MASS_GAIN'
    | 'STRENGTH'
    | 'FAT_LOSS'
    | 'ENDURANCE'
    | 'CONDITIONING'
  about?: string | null
}

export default async function changeProfileById({
  userId,
  ...fields
}: UpdateProfileInput) {
  const updated = await db
    .update(profiles)
    .set({
      ...fields,
    })
    .where(eq(profiles.userId, userId))
    .returning()
    .catch(err => {
      throw new DrizzleException('updateSet', err)
    })

  if (!updated || updated.length === 0) {
    throw new UserNotFoundException(userId)
  }

  return updated[0] ?? null
}

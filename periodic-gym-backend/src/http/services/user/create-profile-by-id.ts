import { db } from '../../../database/client'
import { profiles } from '../../../database/schema/profiles'
import DrizzleException from '@/http/errors/drizzle-exception'
import UserNotFoundException from '@/http/errors/user-not-found'

type CreateProfileInput = {
  userId: string
  weight: string
  height: string
  gender: 'MALE' | 'FEMALE'
  mainObjective:
    | 'MASS_GAIN'
    | 'STRENGTH'
    | 'FAT_LOSS'
    | 'ENDURANCE'
    | 'CONDITIONING'
  about?: string | null
}

export default async function createProfileById({
  userId,
  ...fields
}: CreateProfileInput) {
  const created = await db
    .insert(profiles)
    .values({
      userId,
      ...fields,
    })
    .returning()
    .catch(err => {
      throw new DrizzleException('insertValues', err)
    })

  return created[0] ?? null
}

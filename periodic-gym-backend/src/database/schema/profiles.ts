import { randomUUIDv7 } from 'bun'
import {
  pgTable,
  text,
  pgEnum,
  numeric,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE'])
export const objectiveEnum = pgEnum('main_objective', [
  'MASS_GAIN',
  'STRENGTH',
  'FAT_LOSS',
  'ENDURANCE',
  'CONDITIONING',
])
export const roleEnum = pgEnum('role', ['ADMIN', 'USER'])

export const profiles = pgTable('profiles', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  gender: genderEnum().notNull(),
  weight: numeric('weight').notNull(),
  height: numeric('height').notNull(),
  mainObjective: objectiveEnum().notNull(),
  about: varchar('about', { length: 256 }),
  role: roleEnum()
    .$defaultFn(() => 'USER')
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
})

import { randomUUIDv7 } from 'bun'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { badges } from './badges'
import { users } from './users'

export const userBadges = pgTable('user_badges', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  badgeId: text('badge_id')
    .notNull()
    .references(() => badges.id, { onDelete: 'cascade' }),
  achievedAt: timestamp('achieved_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

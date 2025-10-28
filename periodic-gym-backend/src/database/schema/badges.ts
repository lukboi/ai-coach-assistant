import { randomUUIDv7 } from 'bun'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const badges = pgTable('badges', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

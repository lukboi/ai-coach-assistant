import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { randomUUIDv7 } from 'bun'
import { cycles } from './cycles'

export const workouts = pgTable('workouts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  cycleId: text('cycle_id').references(() => cycles.id, {
    onDelete: 'cascade',
  }),
  date: timestamp('date').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
})

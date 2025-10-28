import { randomUUIDv7 } from 'bun'
import { integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { exercises } from './exercises'

export const progressLogs = pgTable('progress_logs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  weight: numeric('weight'),
  reps: integer('reps'),
  date: timestamp('date')
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

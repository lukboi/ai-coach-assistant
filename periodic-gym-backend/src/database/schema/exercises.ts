import { randomUUIDv7 } from 'bun'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const exercises = pgTable('exercises', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  name: text('name').notNull(),
  muscleGroup: text('muscle_group'),
  equipment: text('equipment'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { workouts } from './workouts'
import { randomUUIDv7 } from 'bun'

export const feedbacks = pgTable('feedbacks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  workoutId: text('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  rating: text('rating').notNull(),
  comments: text('comments'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

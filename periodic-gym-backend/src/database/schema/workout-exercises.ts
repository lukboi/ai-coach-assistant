import { randomUUIDv7 } from 'bun'
import { integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { workouts } from './workouts'
import { exercises } from './exercises'

export const workoutExercises = pgTable('workout_exercises', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  workoutId: text('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  sets: integer('sets').notNull().default(3),
  reps: integer('reps').notNull().default(10),
  load: numeric('load'),
  notes: text('notes'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
})

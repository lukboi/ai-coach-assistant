import { randomUUIDv7 } from 'bun'
import {
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const statusEnum = pgEnum('status', ['PLANNED', 'ACTIVE', 'COMPLETED'])

export const cycles = pgTable('cycles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUIDv7()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 64 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  status: statusEnum().notNull().default('PLANNED'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
})

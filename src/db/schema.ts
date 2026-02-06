import { user } from 'auth-schema'
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
export * from './auth-schema'

export const TodoStatuses = ['PENDING', 'COMPLETED', 'SCHEDULED', 'ARCHIVED'] as const;

export const TodoStatusEnum = pgEnum('post_status', TodoStatuses);

export const todo = pgTable('todo', {
  id: uuid().primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text().notNull(),
  status: TodoStatusEnum('status').default('PENDING'),
  createdAt: timestamp('created_at').defaultNow(),
})

export type TodoSelect = typeof todo.$inferSelect;
export type TodoInsert = typeof todo.$inferInsert;

export const todoRelations = relations(todo, ({ one }) => ({
  user: one(user, {
    fields: [todo.userId],
    references: [user.id],
  }),
}));

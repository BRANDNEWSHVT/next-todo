import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: varchar().notNull(),
  completed: boolean().notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

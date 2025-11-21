import db from "./client";
import { todos } from "./schema";

export const seedTodos = async () => {
  const todosData = [
    { title: 'Learn Next.js', completed: false },
    { title: 'Learn Drizzle', completed: false },
    { title: 'Learn TypeScript', completed: false },
    { title: 'Learn React', completed: false },
    { title: 'Learn Node.js', completed: false },
  ];

  for (const todo of todosData) {
    await db.insert(todos).values(todo);
  }
};

await seedTodos();

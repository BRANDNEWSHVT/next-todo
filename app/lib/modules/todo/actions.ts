'use server';

import { desc, eq, lt, and, ilike } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import db from '@/app/lib/db/client';
import { createTodoSchema } from '@/app/lib/modules/todo/validators';
import { todos } from '@/app/lib/db/schema';

export async function createTodoAction(
  _prevState: { errors: { title?: string[] } },
  formData: FormData
) {
  const title = formData.get('title')?.toString();

  const parsed = createTodoSchema.safeParse({ title });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await db.insert(todos).values({ title: parsed.data.title }).returning();

  revalidatePath('/');
  redirect('/');
}

export async function deleteTodoAction(id: number) {
  await db.delete(todos).where(eq(todos.id, id));

  revalidatePath('/');
  redirect('/');
}

export async function toggleTodoAction(id: number, completed: boolean) {
  await db
    .update(todos)
    .set({
      completed,
    })
    .where(eq(todos.id, id));

  revalidatePath('/');
  redirect('/');
}

export async function fetchTodosAction(
  cursor?: number,
  limit = 10,
  filters: { search?: string; completed?: string } = {}
) {
  const parsedLimit = Math.max(1, Math.min(limit, 50));

  const conditions = [];

  if (cursor) {
    conditions.push(lt(todos.id, cursor));
  }

  if (filters.search) {
    conditions.push(ilike(todos.title, `${filters.search}%`));
  }

  if (filters.completed) {
    conditions.push(eq(todos.completed, filters.completed === '1'));
  }

  const whereConditions =
    conditions.length > 0 ? and(...conditions) : undefined;

  const q = await db
    .select()
    .from(todos)
    .where(whereConditions)
    .orderBy(desc(todos.id))
    .limit(parsedLimit + 1);

  const items = q;
  const hasMore = items.length > parsedLimit;
  const result = items.slice(0, parsedLimit);
  const nextCursor = result.length ? result[result.length - 1].id : undefined;

  return { todos: result, hasMore, nextCursor };
}

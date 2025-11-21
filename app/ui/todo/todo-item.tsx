'use client';

import {
  deleteTodoAction,
  toggleTodoAction,
} from '@/app/lib/actions/todo/actions';
import { useTransition } from 'react';

interface ITodo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoItem({ todo }: { todo: ITodo }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleTodoAction(todo.id, !todo.completed);
    });
  }

  function handleDelete() {
    const confirm = window.confirm(
      'Are you sure you want to delete this todo?'
    );
    if (!confirm) return;

    startTransition(async () => {
      await deleteTodoAction(todo.id);
    });
  }

  return (
    <div className="flex items-center justify-between gap-2 p-2 border border-base-300 rounded">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="checkbox"
          checked={Boolean(todo.completed)}
          onChange={handleToggle}
          disabled={isPending}
        />
        <div className={todo.completed ? 'line-through opacity-60' : ''}>
          {todo.title}
        </div>
      </div>
      <div>
        <button
          className="btn btn-ghost btn-sm text-error hover:bg-error/10 hover:border-error/10"
          onClick={handleDelete}
          disabled={isPending}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

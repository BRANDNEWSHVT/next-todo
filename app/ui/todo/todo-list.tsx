'use client';

import { useState, useTransition } from 'react';
import { fetchTodosAction } from '@/app/lib/modules/todo/actions';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import TodoItem from './todo-item';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface Props {
  initialTodos: Todo[];
  initialHasMore: boolean;
  initialNextCursor?: number;
}

const TodoList = ({
  initialTodos,
  initialHasMore,
  initialNextCursor,
}: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState<number | undefined>(
    initialNextCursor
  );
  const [isPending, startTransition] = useTransition();
  const [isLoadMorePending, setIsLoadMorePending] = useState(false);
  const skeletonItems = Array.from({ length: 4 });

  const fetchMoreTodos = async () => {
    const result = await fetchTodosAction(nextCursor, 5, {
      search: searchParams.get('q') || undefined,
      completed: searchParams.get('completed') || undefined,
    });
    return result;
  };

  const loadMore = () => {
    if (!hasMore || isPending) return;

    setIsLoadMorePending(true);
    startTransition(async () => {
      try {
        const result = await fetchMoreTodos();
        setTodos((prev) => [...prev, ...result.todos]);
        setHasMore(result.hasMore);
        setNextCursor(result.nextCursor);
      } finally {
        setIsLoadMorePending(false);
      }
    });
  };

  const handleFilterChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const filters: { search?: string; completed?: string } = {};

      switch (e.target.name) {
        case 'q':
          filters.search = e.target.value;
          break;
        case 'completed':
          filters.completed = e.target.checked ? '1' : undefined;
          break;
      }

      const params = new URLSearchParams(searchParams.toString());
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      router.replace(`${pathName}?${params.toString()}`);

      startTransition(async () => {
        const result = await fetchTodosAction(undefined, 5, {
          search: filters.search,
          completed: filters.completed,
        });
        setTodos(result.todos);
        setHasMore(result.hasMore);
        setNextCursor(result.nextCursor);
      });
    },
    300
  );

  return (
    <div className="space-y-4">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex gap-2">
            <input
              name="q"
              className="input input-bordered w-full"
              type="text"
              placeholder="Search todos..."
              onChange={(e) => handleFilterChange(e)}
              defaultValue={searchParams.get('q') || ''}
            />
            <label className="label">
              <input
                name="completed"
                type="checkbox"
                className="checkbox"
                onChange={(e) => handleFilterChange(e)}
                defaultChecked={Boolean(searchParams.get('completed'))}
              />
              <span className="label-text">Completed</span>
            </label>
          </div>
          <div className="relative">
            <div className="space-y-2 transition-opacity">
              {todos.length === 0 ? (
                <p className="text-sm opacity-60 text-center py-4">
                  No todos yet. Create one above!
                </p>
              ) : (
                todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
              )}
            </div>
          </div>
          {isLoadMorePending && (
            <div className="space-y-2">
              {skeletonItems.map((_, index) => (
                <div
                  key={`load-more-${index}`}
                  className="h-12 w-full rounded border border-base-200 bg-base-200/70"
                />
              ))}
            </div>
          )}
          {hasMore && (
            <div className="text-center py-4">
              <button
                className="btn btn-ghost"
                onClick={loadMore}
                disabled={isPending}
              >
                {isPending ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;

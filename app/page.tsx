import { Suspense } from 'react';

import TodoForm from './ui/todo/todo-form';
import TodoList from './ui/todo/todo-list';

import { fetchTodosAction } from './lib/modules/todo/actions';

const Home = async () => {
  const { todos, hasMore, nextCursor } = await fetchTodosAction(undefined, 5);

  return (
    <div className="space-y-6">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Todos</h1>
        <TodoForm />
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <Suspense
          fallback={<div className="text-center py-8">Loading todos...</div>}
        >
          <TodoList
            initialTodos={todos}
            initialHasMore={hasMore}
            initialNextCursor={nextCursor}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;

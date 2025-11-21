'use client';

import { useActionState } from 'react';
import { createTodoAction } from '@/app/lib/modules/todo/actions';
import SubmitButton from './submit-button';

const TodoForm = () => {
  const [state, formAction] = useActionState(createTodoAction, { errors: {} });

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          name="title"
          className="input input-bordered flex-1"
          placeholder="Add a new todo..."
        />
        <SubmitButton />
      </div>
      {state.errors?.title && (
        <small className="text-error text-sm">
          {state.errors.title.join(', ')}
        </small>
      )}
    </form>
  );
};

export default TodoForm;

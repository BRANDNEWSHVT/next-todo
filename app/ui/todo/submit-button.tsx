'use client';

import { useFormStatus } from 'react-dom';
import clsx from 'clsx';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx('btn', {
        loading: pending,
        'btn-disabled': pending,
      })}
      disabled={pending}
    >
      {pending ? 'Creating...' : 'Create'}
    </button>
  );
}

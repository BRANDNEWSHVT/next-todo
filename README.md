# Todo

![Todo App](screenshot.jpg)

This project is a [Next.js 16](https://nextjs.org/) app that showcases a server-action powered todo list with incremental loading, filtering, and Postgres persistence via [Drizzle ORM](https://orm.drizzle.team/).

## Features

- Add todo items with client-side validation handled by [Zod](https://zod.dev/) schemas and server actions.
- Filter by search text or completion status with debounced requests to avoid redundant fetches.
- Paginated loading that fetches additional pages when the user clicks **Load more** while preserving optimistic UI feedback.
- Toggle and delete todos through server actions that revalidate the `/` route and redirect to keep the UI in sync.
- Styled with [DaisyUI](https://daisyui.com/) themes layered on top of Tailwind CSS v4 from the Next.js app router.

## Tech Stack

- **Next.js 16** (App Router, Suspense, server actions)
- **React 19** with `useTransition`/`useActionState`
- **Drizzle ORM** + PostgreSQL for schema-driven persistence
- **Zod** for schema validation
- **use-debounce** to throttle filter input
- **DaisyUI / Tailwind CSS v4** for UI primitives
- **DaisyUI** provided components (cards, buttons, inputs) with Tailwind base utilities

## Requirements

- [Bun 1.x](https://bun.sh/) (preferred runtime for scripts/builds) or Node.js 18+
- PostgreSQL database for the `todos` table
- `DATABASE_URL` environment variable pointing to the Postgres instance
- Docker & Docker Compose (optional, for containerized setup)

## Getting Started

1. **Install dependencies (Bun)**

   ```bash
   bun install
   ```

2. **Create a `.env.local` file** in the project root and set the database URL:

   ```bash
   DATABASE_URL=postgres://user:password@localhost:5432/dbname
   ```

3. **Initialize the database**

   ```bash
   bun run db:generate
   bun run db:migrate
   # Optional: bun run db:seed (see app/lib/db/seed.ts)
   ```

4. **Start the development server**

   ```bash
   bun run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to open the todos experience.

## Database Schema

- Defined in `app/lib/db/schema.ts` with a `todos` table (id serial primary key, title text, completed boolean, createdAt timestamp).
- Server actions live in `app/lib/modules/todo/actions.ts`, leveraging `drizzle-orm` to query, insert, update, and delete todos.
- Refresh and redirect hooks (`revalidatePath`, `redirect`) keep the UI aligned with the server state.

## Scripts

> Use `bun run <script>` (or `npm run <script>` if you prefer Node).

- `dev`: Run Next.js in development mode
- `build`: Compile for production
- `start`: Start the production server (`next start`)
- `lint`: Run ESLint
- `db:generate`: Generate Drizzle migrations
- `db:migrate`: Apply migrations
- `db:seed`: Seed the database with sample data (manual script)

## Testing & Quality

- No automated tests are included yet. Use `npm run lint` to keep the codebase consistent.

## Docker & Compose

- `Dockerfile` uses Bun multi-stage builds and the `entrypoint.sh` script to run Drizzle migrations before starting `server.js`.
- `docker-compose.yml` spins up:
  1. `web`: Next.js server (port 3000) with `DATABASE_URL=postgres://postgres:postgres@db:5432/todos`
  2. `db`: Postgres 17 (exposes 5433 on the host, persisting data in `postgres_data` volume)
  3. `cron`: lightweight Alpine container running a cron job that hits `http://web:3000/db/clear` every 10 min (customize/remove as needed)

### Run everything via Compose

```bash
docker compose up --build
```

> The entrypoint inside the `web` container runs `bun run db:generate` and `bun run db:migrate` automatically before launching the server.

Stop services:

```bash
docker compose down -v
```

## Deployment

1. Run `bun run build` (or `npm run build`) to produce an optimized build.
2. Deploy the `.next/standalone` output or container image to your hosting provider (Vercel, Fly.io, etc.).
3. Provide a production `DATABASE_URL` and run migrations (handled automatically in the provided container entrypoint).

For additional deployment options, review the [official Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).

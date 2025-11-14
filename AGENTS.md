# Agent Instructions for DCOI

## 1. What This Project Is

DCOI (DevOps Carbon Offset Initiative) is a GitHub App that measures CI/CD (GitHub Actions) usage and converts it into carbon offsets via verified projects.

- Frontend: React + TanStack Router + Grommet UI
- Backend: TanStack Start (Vite) + Nitro SSR
- Data: MongoDB with Mongoose
- Domain: GitHub App (installations, marketplace plans, workflows, wallets, projects)

This file describes **how to extend the project without casser l’architecture**.

---

## 2. Commands You Should Know

- Dev server: `npm run dev`
- Build (client + server/Nitro): `npm run build`
- Start production: `npm run start` (serves `.output/server/index.mjs`)
- Lint: `npm run lint`
  - Auto-fix (recommandé avant commit): `npm run lint -- --fix`

> There is **no test runner yet**. If you add tests, prefer **Vitest** for unit/integration tests.

---

## 3. Global Architecture & Responsibilities

The project is layered. **Never bypass layers**.

### 3.1 Layers

- `src/routes/`
  - File-based routes (client-facing UI routes under `(client)`, API/webhook routes under `api`).
- `src/client/`
  - React UI components + React Query hooks/options.
- `src/controller/`
  - “Use server functions” layer: `createServerFn` wrappers with **all input validation** (Zod).
  - No DB access here.
- `src/server/`
  - `createServerOnlyFn` functions with **all DB and external API calls**.
- `src/server/db/schemas/`
  - Mongoose schemas/models.

### 3.2 Allowed Import Directions (Very Important)

These rules are enforced by `eslint.config.js` (via `no-restricted-imports`):

- **Client (`src/client/**`)\*\*
  - ✅ Can import: `@client/*`, `@controller/*`, `@routes/*` (via router APIs), external libs.
  - ❌ Cannot import: `@server/*`, `@utils/react-start`, any DB/schema.

- **Controller (`src/controller/**`)\*\*
  - ✅ Can import: `@server/functions/*`, DTOs/Zod schemas, external libs.
  - ❌ Cannot import: `@server/db/**`, `@client/**`, `@routes/**`, `@tanstack/react-query`, `createServerOnlyFn`.

- **Server (`src/server/**`)\*\*
  - ✅ Can import: `@server/db/*`, external APIs, `createServerOnlyFn`.
  - ❌ Cannot import: `@controller/functions/**`, `@client/**`, `@routes/**`, `createServerFn`.

- **Routes/`api` (`src/routes/api/**`)\*\*
  - ✅ Can import: `@server/functions/*`, external libs, routing utilities.
  - ❌ Cannot import: `@server/db/**`, `@controller/**`, `@client/**`, `@routes/(client)/**`, `@tanstack/react-query`.

- **Routes/`(client)` (`src/routes/(client)/**`)\*\*
  - ✅ Can import: `@client/*`, `@routes/*` helpers, `@tanstack/react-router`.
  - ❌ Cannot import: `@server/**`, `@controller/**`, `@routes/api/**`, `@tanstack/react-query`, `@utils/react-start`.

If tu ne respectes pas ça, `npm run lint` va te le rappeler.

---

## 4. File-Type Rules

- **`.tsx` files**
  - ✅ Only in `src/client/components/**`
  - ❌ Not allowed in `src/routes/**`, `src/server/**`, `src/controller/**`
- **Routes under `(client)`**
  - Use `.ts` files that export a `Route` via `createFileRoute`.
  - Components used by routes MUST live in `src/client/components/**.tsx`.

Example:

```ts
// src/routes/(client)/projects/index.ts
import { createFileRoute } from "@tanstack/react-router";
import { ProjectsIndex } from "@client/components/projects/projects-index";
import { adminProjectsQueryOptions } from "@client/utils/queries/projects";

export const Route = createFileRoute("/(client)/projects/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(adminProjectsQueryOptions());
  },
  component: ProjectsIndex,
});
```

---

## 5. Route Rules (TanStack Router)

### 5.1 (client) Routes

**ALL routes under `(client)` MUST define a loader.**

Pattern:

```ts
export const Route = createFileRoute("/(client)/some/path")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(queryOptions(/* maybe params */));
  },
  component: SomeComponent,
});
```

- The loader only interacts with:
  - `context.queryClient`
  - Query options from `@client/utils/queries/*` (which are safe to import)
- It must **not** call server/controller directly (eslint prevents that).

### 5.2 API Routes

`src/routes/api/github/index.ts` etc.:

- Handle webhooks and API endpoints.
- Use `@server/functions/**` for DB logic.
- Do not import client or controllers.

---

## 6. Controller Layer Rules (`src/controller/**`)

Controllers are the **only place** where you:

- Use `createServerFn()` (TanStack Start).
- Do input validation with **Zod**.
- Wrap server-only functions.

Pattern:

```ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCommunityStats } from "@server/functions/community";

const CommunityStatsSchema = z.void(); // or object schema

export const getCommunityStatsController = createServerFn()
  .inputValidator(CommunityStatsSchema)
  .handler(async ({ data }) => {
    return await getCommunityStats();
  });
```

Rules:

- **Never import** `@server/db/**` here.
- All parameters coming from client should be validated with Zod.
- Admin-protected actions must check `process.env.ADMIN_PASSWORD` (or similar).

---

## 7. Server Layer Rules (`src/server/**`)

Server functions are **DB-only and external API-only**.

Pattern using `createServerOnlyFn`:

```ts
import { createServerOnlyFn } from "@tanstack/react-start";
import databaseConnect from "../db/mongoose";
import { walletModel } from "../db/schemas/wallet-schema";

export const getCommunityStats = createServerOnlyFn(async () => {
  await databaseConnect();

  const wallets = await walletModel.find({ active: true }).lean();
  const communityBalance = wallets.reduce(
    (sum, wallet) => sum + wallet.balanceCredits,
    0,
  );

  return { communityBalance };
});
```

Rules:

- Always `await databaseConnect()` before DB queries.
- Use `.lean()` for read queries where possible.
- No Zod here (validation is in controller).
- No imports from `@controller/**` or `@client/**`.

---

## 8. Client Layer Rules (`src/client/**`)

### 8.1 Components (`src/client/components/**`)

- Must be **function components** using `export function Name()`.
- Use **Grommet** for layout and UI (`Box`, `Heading`, `Grid`, `Card`, etc.).
- Data fetching is done via `useSuspenseQuery` with query options.

Example:

```tsx
import { Box, Heading } from "grommet";
import { useSuspenseQuery } from "@tanstack/react-query";
import { communityStatsQueryOptions } from "@client/utils/queries/community";

export function Community() {
  const { data } = useSuspenseQuery(communityStatsQueryOptions());
  const { communityBalance } = data;

  return (
    <Box pad="medium">
      <Heading level={1}>Community Wallet</Heading>
      {/* ... */}
    </Box>
  );
}
```

### 8.2 Query Options (`src/client/utils/queries/**`)

These are the only place where the client layer calls controllers.

Pattern:

```ts
import { queryOptions } from "@tanstack/react-query";
import { getCommunityStatsController } from "@controller/functions/community";

export const communityStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["communityStats"],
    queryFn: () => getCommunityStatsController(),
  });
```

Rules:

- Do not use controller or server directly in components.
- Always define a stable `queryKey`.
- Map controller responses to a shape that is easy for components.

---

## 9. Linting & Style Rules

Configured in `eslint.config.js`:

- `tanstackConfig` + `unicorn` + `prettier` + `sonarjs`.
- Ignored: `src/routeTree.gen.ts`, `dist/**`, `.nitro/**`, `.output/**`, `node_modules/**`, files starting with `._`.

Important rules:

- `max-params`: maximum **4 parameters per function**.
- `unicorn/no-array-sort`: warns when using `.sort()`; prefer `toSorted()` where appropriate.
- Multiple `no-restricted-imports` sections enforce the architecture described above.
- Import sorting and formatting are enforced; let `npm run lint -- --fix` handle the trivial ones.

> Always run `npm run lint` before pushing or opening a PR.

---

## 10. Security Guidelines

- **Never** log secrets or access tokens.
- All sensitive values must come from environment variables:
  - `MONGODB_URI`, `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET`, `ADMIN_PASSWORD`, etc.
- Validate **all inputs** in controllers with Zod.
- Webhook handlers must verify GitHub signatures (see existing `webhook` server functions/routes).
- Admin routes/actions must check admin password or equivalent guard.

---

## 11. Performance & Build Notes

- The main client bundle is currently > 500 kB (Vite warns about chunk size).
  - Prefer route-level code splitting via lazy-loaded components if bundle grows.
  - Keep heavy admin-only UI and analytics behind separate chunks.
- Always use `.lean()` for read-heavy MongoDB queries to reduce memory overhead.
- Use React Query caching options (`staleTime`, `gcTime`) for expensive queries.

---

## 12. Adding a New Feature – Checklist

When you add a new feature with data fetching, follow this checklist:

1. **Server**
   - [ ] Add a `createServerOnlyFn` in `src/server/functions/feature.ts`.
   - [ ] Use `databaseConnect()` and Mongoose models.
   - [ ] Return plain JSON-serializable data.

2. **Controller**
   - [ ] Add a `createServerFn` wrapper in `src/controller/functions/feature.ts`.
   - [ ] Define a Zod schema for input.
   - [ ] Call the server function only via the controller.

3. **Client**
   - [ ] Add `featureQueryOptions` in `src/client/utils/queries/feature.ts`.
   - [ ] Add a UI component in `src/client/components/feature/feature.tsx`.

4. **Route**
   - [ ] Create/modify file in `src/routes/(client)/feature.ts`.
   - [ ] Add a loader that prefetches `featureQueryOptions()` into `context.queryClient`.
   - [ ] Use the component from `@client/components`.

5. **Validation**
   - [ ] Run `npm run lint`.
   - [ ] Run `npm run build`.

If tout est vert (lint + build OK), tu es dans les clous de l’architecture DCOI.

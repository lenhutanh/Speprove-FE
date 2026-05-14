# AGENTS.md

## Commands

Run commands from `speprove-fe/`.

- Install dependencies: `pnpm install`
- Dev server: `pnpm dev`
- Production build: `pnpm build`
- Start production server: `pnpm start`
- Lint: `pnpm lint`
- Type check: `pnpm type-check`
- Format: `pnpm format`

There is currently no test script configured in `package.json`.

## Conventions

- Use `pnpm`; the frontend has `pnpm-lock.yaml`.
- This is a Next.js App Router project. Add routes under `src/app`, not `pages`.
- Use the `@/*` alias for imports from `src/*`.
- Locale-aware routing should use helpers from `src/i18n/navigation`.
- Shared UI belongs in `src/components/ui`, `src/components/form`, `src/components/layout`, `src/components/loading`, or another existing shared component folder.
- Route-specific UI belongs near the route in an `_components` folder.
- API/domain additions should follow the existing pattern:
  - API config in `src/constants/api-config.ts`
  - request wrappers in `src/api-requests`
  - React Query hooks in `src/queries`
  - types in `src/types`
  - Zod schemas in `src/validations`
- Use the existing `http` wrapper from `src/utils/http.util.ts` for API calls.
- Use React Query for server state and Zustand for client/app state.
- Prefer existing UI/form components before creating new primitives.
- Use `cn()` from `src/lib/utils.ts` for merging class names.
- Follow existing formatting: no semicolons, single quotes, 2-space indentation.

## Edit Boundaries

- Prefer minimal, focused changes.
- Do not refactor unrelated files while implementing a feature or fix.
- Do not revert user changes unless explicitly asked.
- Keep new abstractions small and only add them when they match existing patterns or remove real duplication.
- Avoid introducing new dependencies unless the task clearly requires it.
- Do not add business logic descriptions or large docs unless requested.

## Validation Checklist

Before finishing code changes, run the relevant checks:

- `pnpm lint`
- `pnpm type-check`
- `pnpm build` for changes that affect routing, config, providers, or build-time behavior

If a check cannot be run, mention why in the final response.

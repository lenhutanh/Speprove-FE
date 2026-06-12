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
- **UI & Styling Guidelines:** Always adhere to the design rules defined in [docs/UI_GUIDELINES.md](file:///d:/IT/Speprove/speprove-fe/docs/UI_GUIDELINES.md).

## UI Development Workflow

When implementing or modifying any user interface elements, the AI agent **MUST** follow this sequence:

1.  **Read UI Guidelines:** Open and read [docs/UI_GUIDELINES.md](file:///d:/IT/Speprove/speprove-fe/docs/UI_GUIDELINES.md) to understand layout, colors, typography, cards, and states constraints.
2.  **Check Existing Feature (MANDATORY):** Before creating a new screen or component, inspect similar screens already present in the codebase and follow the established visual pattern. Inspect at least one similar screen before creating a new UI. Reuse the existing interaction and visual patterns whenever possible.
3.  **Check Local Components:** Inspect existing shared components in `src/components/ui`, `src/components/form`, and `src/components/layout`.
4.  **Query Shadcn MCP:** Before creating custom layouts or controls, search the Shadcn MCP registry (if available) to see if a standard primitive can be reused or added.
5.  **Execute & Implement:** Code the component following standard Next.js and Tailwind CSS patterns.
6.  **Run Quality Checks:** Execute `pnpm lint` and `pnpm type-check` to verify code correctness.
7.  **Perform Visual Verification:** Perform rendering tests to confirm visual appearance.

## Shadcn Workflow

Before implementing complex interactive patterns:

- The agent **MUST** query the shadcn MCP to find standard implementations for:
  `Dialog`, `Sheet`, `Drawer`, `Form`, `Table`, `Combobox`, `Command`, `Popover`, `Calendar`.
- Do not build custom modals, date-pickers, or dropdowns if an equivalent Shadcn primitive exists.
- When shadcn MCP provides a suitable primitive:
  - Prefer adopting the shadcn implementation.
  - Avoid building custom equivalents unless project requirements cannot be satisfied through composition or extension.

## UI Verification Workflow

After writing or updating UI code, when browser and execution tools are available (e.g. Cline, Kiro, Antigravity):

1.  **Start Dev Server:** Launch `pnpm dev` and ensure it runs successfully.
2.  **Inspect Layout:** Open the page using the browser agent (`browser_subagent`).
3.  **Responsive Check:** Validate the layout on mobile (narrow viewport) and desktop (wide viewport) width constraints.
4.  **Theme Check:** Verify that the page renders correctly in both Light Mode and Dark Mode. Ensure all background and text colors adapt seamlessly.
5.  **State Check:** Verify visual feedback for empty list items, loading skeletons, and error messages.

If tooling is not available (such as web-only model integrations):

- Carefully review code changes statically against the rules defined in [docs/UI_GUIDELINES.md](file:///d:/IT/Speprove/speprove-fe/docs/UI_GUIDELINES.md) and verify dark mode compatibility.

## Edit Boundaries

- Prefer minimal, focused changes.
- Do not refactor unrelated files while implementing a feature or fix.
- Do not revert user changes unless explicitly asked.
- Keep new abstractions small and only add them when they match existing patterns or remove real duplication.
- Avoid introducing new dependencies unless the task clearly requires it.
- Do not add business logic descriptions or large docs unless requested.
- **Shared Component Modifications:** Strictly follow the _Shared Component Modification Policy_ in [docs/UI_GUIDELINES.md](file:///d:/IT/Speprove/speprove-fe/docs/UI_GUIDELINES.md) before modifying any files in `src/components/ui/` or `src/components/layout/`.

## Validation Checklist

Before finishing code changes, run the relevant checks:

- `pnpm lint`
- `pnpm type-check`
- `pnpm build` for changes that affect routing, config, providers, or build-time behavior

If a check cannot be run, mention why in the final response.

# Copilot / Agent Instructions — djazairi-invoice-maker-pro

Short, actionable guidance for AI coding agents working in this repo.

## Project Snapshot
- Tech: Vite + React + TypeScript + TailwindCSS (shadcn UI primitives). See `package.json` scripts (dev/build/preview/lint).
- Purpose: Lightweight Arabic invoice creator. Key UI files: `src/components/InvoiceForm.tsx`, `src/components/InvoiceItem.tsx`, `src/components/InvoicePreview.tsx`.
- Entry: `src/main.tsx` -> `src/App.tsx`. Routes live under `src/pages/` (e.g., `Index.tsx`).

## Quick Commands
- Install: `npm i`
- Dev server: `npm run dev` (Vite)
- Build (prod): `npm run build` or `npm run build:dev` (development build)
- Preview production build: `npm run preview`
- Lint: `npm run lint` (uses ESLint configured in `eslint.config.js`)

## Key Patterns & Conventions (be explicit)
- Path alias: use `@/...` to import from `src` (configured in `tsconfig.json`).
  - Example: `import { Button } from '@/components/ui/button'`.
- UI primitives live in `src/components/ui/` and wrap Radix + Tailwind styles. New UI components should follow this pattern, leveraging Radix for accessibility and Tailwind for styling.
- Core services like database, Firebase, internationalization, and synchronization are located in `src/core/`.
- `InvoiceForm.tsx` is the central component for managing and updating the invoice state.
- Components are functional React components with TypeScript; prefer small, focused props and explicit interfaces (see `InvoiceItem`'s `Item` interface).
- Styling: Tailwind CSS is used extensively for styling. Always prioritize existing Tailwind utility classes and the custom color tokens (`dz-` prefix) defined in `tailwind.config.ts`. Remember to consider RTL (Right-to-Left) layouts and reuse `rtl` and `rtl:space-x-reverse` utility classes when applicable.
- Notifications: Use the existing notification systems: the Radix-based `Toaster` wrapper or Sonner (`src/components/ui/sonner.tsx`). Do not introduce new notification implementations.
- State Management: Local React state is used for managing invoice data within `InvoiceForm.tsx`. For any new features requiring remote data fetching or persistence, utilize `@tanstack/react-query` which is already configured in `App.tsx` and follow its QueryClient conventions.
- Modules: `src/core/` contains essential services like `db.ts`, `firebase.ts`, `i18n.ts`, and `syncService.ts`. `src/features/` organizes code by feature, such as `invoice` and `settings`, each with its own components, hooks, and types.

## Data/Business Rules to Preserve
- VAT and currency are hardcoded in the UI: VAT = 19% and currency printed as `دج` (Algerian Dinar). See `InvoiceItem.tsx` and `InvoicePreview.tsx` for calculations and presentation. Change these only with explicit tests/specs.
- Printing: invoice preview supports `window.print()` and uses print-specific classes (e.g., `print:hidden`). Verify print output visually.

## Where to Make Changes
- Add new pages: add files under `src/pages/` and add routes in `src/App.tsx` (React Router v6 used).
- Shared components / primitives: put them under `src/components/ui/` following the shape of existing components (props, theme mapping, toast/toaster patterns).
- Styles & theme tokens: update `tailwind.config.ts` for global theme changes (e.g., colors, fonts). Keep Arabic fonts and `dz-` palette unless intentionally rebranding.

## Tests & CI
- There are currently no automated tests or CI configuration in the repo. Validate changes locally:
  - Run `npm run dev` and navigate to app.
  - For production check: `npm run build` then `npm run preview`.
- Run `npm run lint` as a quick static check; ESLint config turns off `@typescript-eslint/no-unused-vars` in `eslint.config.js`.

## Helpful Implementation Tips
- Reuse existing UI wrappers (e.g., `Button`, `Input`, `Toast`) to preserve styling and accessibility.
- Keep components small and stateless where possible — `InvoiceForm` manages state and passes it down; `InvoicePreview` is pure rendering logic.
- Use `Intl.DateTimeFormat('ar-DZ')` for dates (see `InvoicePreview.formatDate`).
- New features that fetch or persist data should use react-query and follow QueryClient conventions already in `App.tsx`.

## Files to Inspect When Changing Behavior
- `src/components/InvoiceForm.tsx` — main invoice editor UI
- `src/components/InvoiceItem.tsx` — item editing, calculations
- `src/components/InvoicePreview.tsx` — formatted printable invoice
- `src/components/ui/*` — shared UI primitives and wrappers
- `tailwind.config.ts` — theme tokens (colors/fonts/animations)
- `tsconfig.json` — import aliases
- `eslint.config.js` — linting rules

## What not to assume
- Database interactions: Any database interactions are currently simulated or local (e.g., using `localStorage` or in-memory data). There is no live backend or database configured in this repository.
- No test harness or CI pipeline exists; include instructions if you add one.

## Recent Features: Product/Service & Client Management
- **IndexedDB Integration:** Implemented lightweight local-only storage using `idb` package (wrapper around IndexedDB).
  - Location: `src/core/localDbService.ts` — exports `addProductService()`, `getRecentProductServices()`, `addClient()`, `getRecentClients()`.
  - Storage: Two object stores (`products` and `clients`) with auto-increment IDs. Retrieves last 10 items by default.
- **Settings Page Enhancement:** Added two new cards to `src/features/settings/components/SettingsView.tsx`:
  - **Product/Service Management:** Users can add product/service name + price; recent items display in a scrollable list.
  - **Client Management:** Users can add client name; extensible to include address, phone, NIF, RC via form expansion.
- **Type Updates:** Extended `AppSettings` in `src/features/settings/types/settings.ts` with `recentProductServices` and `recentClients` arrays.
- **No Server Dependency:** All data stays in the browser via IndexedDB; no backend API calls. Persists across page reloads but clears on browser cache clear.

---

```
If you want, I can (1) expand any section with more examples (imports/usages), (2) add a small checklist for pull requests, or (3) open a PR that adds a test or CI skeleton. Which would you prefer? 

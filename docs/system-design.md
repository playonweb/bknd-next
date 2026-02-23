# System Design: Neu ToDo App

## Architecture Overview

The `Neu ToDo App` follows a **Unified Hybrid Architecture** using Next.js 15. This approach merges the frontend UI and the backend services into a single deployable unit.

### 1. Unified Layer (Next.js 15)
- **UI Architecture**: React Client Components using the App Router for fast, optimized rendering.
- **API Architecture**: Next.js Route Handlers (`app/api/[...catchall]/route.ts`) act as the entry point for the `bknd` adapter.
- **Backend Runtime**: `bknd` running inside the Next.js server-side process, managing authentication and data persistence.

### 2. Design System (Neumorphism)
- A bespoke CSS utility layer built on **Tailwind CSS v4**.
- Uses HSL-tailored color tokens (`neu-bg`, `neu-light`, `neu-dark`) to create the signature soft-shadow "soft UI" look.
- Interactive states (`convex`, `concave`, `pressed`) are managed via CSS transforms and transitions for a premium feel.

### 3. Data Strategy
- **Persistence**: SQLite (local `data.db`) managed via `bknd`'s ORM logic.
- **SDK**: A singleton `Api` instance in `lib/bknd.ts` provides a type-safe interface for the UI to interact with backend collections.

### 4. Quality & DX
- **Task Orchestration**: `Taskfile.yaml` provides a CLI-like experience for local development (`task dev`) and audits (`task lint`).
- **AST Analysis**: `ast-grep` ensures code patterns follow project standards.
- **CPD**: `jscpd` monitors code duplication to maintain a DRY (Don't Repeat Yourself) codebase.
- **Dependency Health**: `knip` identifies unused exports and packages.

## Component Lifecycle
1. **Request**: Next.js serves the initial HTML and hydration bundle.
2. **Hydration**: Client-side React components mount and trigger an `useEffect` fetch.
3. **Execution**: The `bknd` SDK calls local API Route Handlers.
4. **Processing**: The `bknd` adapter processes the request, interacts with SQLite, and returns JSON.
5. **Reconciliation**: UI state is updated with server-confirmed IDs and timestamps.

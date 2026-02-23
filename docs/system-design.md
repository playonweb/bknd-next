# System Design: Neu ToDo App

## Architecture Overview

The `Neu ToDo App` implements a modern Hybrid architecture using best-in-class tooling:

1. **Frontend**:
    - **Framework**: Vue 3 (Composition API) 
    - **Build Tool**: Vite
    - **Styling**: TailwindCSS 4
    - **UI Paradigm**: Neumorphism design system, avoiding generic colors and explicitly utilizing beautiful concave/convex shadings.

2. **Backend**:
    - **Framework**: `bknd` (Lightweight BaaS runtime)
    - **Database**: SQLite (built-in logic mapped safely)
    - **Integration**: Direct REST API bridging via the `bknd` auto-generated typescript client SDK.

3. **Tooling & DX**:
    - Monorepo structure orchestrated via `Taskfile.yaml`.
    - Code styling and security guarantees via `@ast-grep/cli` and `jscpd`.
    - Dead-code and unused export removal via `knip`.

## Component Lifecycle
When a user launches the app, Vite serves the Vue bundle locally. The app immediately issues requests via the `bknd` client to fetch records. Changes (CRUD operations) interact asynchronously with `bknd`, updating UI predictively and reconciling actual IDs upon successful server-side creation.

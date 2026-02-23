# Neu ToDo App (Next.js + bknd.io)

A premium, professional-grade ToDo application featuring a **Neumorphism** design system, built with **Next.js 15 (App Router)** and integrated with **bknd.io** for a hybrid backend-in-code experience.

![Logo](./logo.svg)

## 🚀 Teck Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS v4 (Custom Neumorphism Utilities)
- **Backend**: bknd.io (Adapters for Next.js App Router)
- **Database**: SQLite (local dev)
- **Language**: TypeScript (Strictly Typed)

## 🛠 Features

- **Hybrid Architecture**: API routes and UI served from a single Next.js process.
- **Rich Aesthetics**: Custom HSL-tailored Neumorphism shadow system.
- **Type Checked**: End-to-end type safety with TypeScript.
- **Enterprise Tooling**: AST-grep for linting, jscpd for copy-paste detection, and Knip for unused dependencies.
- **Automated Workflows**: Full CI/CD pipelines via GitHub Actions.

## 🏃 Getting Started

### Prerequisites
- [pnpm](https://pnpm.io/installation)
- [Task](https://taskfile.dev/installation/) (Optional, but recommended)

### Installation
```bash
task install
# or
pnpm install
```

### Development
```bash
task dev
# or
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your app.

### Quality Checks
```bash
task lint
```

## 📂 Project Structure

- `app/`: Next.js App Router (UI & API handlers).
- `components/`: Reusable React components.
- `lib/`: Shared utility logic and SDK initializers.
- `public/`: Static assets (Logo, Favicons).
- `docs/`: System design and security audits.

## 📄 License
ISC

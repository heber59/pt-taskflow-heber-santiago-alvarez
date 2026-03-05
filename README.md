# 🌌 TaskFlow — Manage Your Universe

You are the owner of a universe where every task is a star. Blue stars are pending, green stars are complete. When you're done with a task, send it supernova — and watch it explode.

---

## Stack

**Base:** Next.js · React · TypeScript · TailwindCSS  
**UI:** shadcn/ui  
**3D:** Three.js · React Three Fiber  
**Tooling:** Bolt.new · v0 · Cursor · Antigravity  
**Testing:** Jest + React Testing Library

---

## Features

### 🌠 Task List with Pagination

Fetched from the API via `lib/api.ts` and `hooks/useTaskApi.ts` using Axios. Results are paginated and merged with local state on every load.

### ⭐ Create a Task

Add a new star to your galaxy. It appears instantly in the 3D view and syncs to the API in the background.

### 🔄 Toggle Status

Mark tasks as complete or pending. Updates are debounced by 2.5 seconds — so rapid toggling won't flood the API with unnecessary calls.

### 💥 Delete a Task (Supernova)

Deleting requires confirmation via a second modal. Every CRUD action shows a flag notification confirming success or failure.

### 🔭 Local Filter

Filter your stars by All, Pending, or Complete using the bar in the top right.

---

## Technical Details

**Architecture**  
All business logic lives in custom hooks. `lib/` handles raw API communication with Axios. Components are purely presentational.

**Typing**  
Fully typed with TypeScript. No `any` — all interfaces and types are organized under `types/` with a barrel `index.ts`.

**Local Persistence**  
Tasks are persisted to `localStorage` so the app works offline. Local state always reflects CRUD operations immediately, even when the API call is pending or fails.

**State Management**  
React Context + `useState` handles all state. If the project scales significantly, migrating to Redux would be the recommended next step.

**Environment Variables**  
All env vars are prefixed with `NEXT_PUBLIC_` and imported through `config/environment/environment.ts` — never accessed directly from components.

**Code Quality**  
ESLint and Prettier are configured with zero errors. Commits follow a descriptive format.

---

## Getting Started

```bash
# Install dependencies
pnpm install

pnpm dev

deployed  https://v0-todo-app-with-three-pm43wneas-heber59s-projects.vercel.app/
```

## Project Origin

Started with v0 by Vercel, scaled with Antigravity, refined and standardized manually.

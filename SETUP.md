# Task Flow - Setup & Development Guide

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Initialize Husky (Git Hooks)

```bash
pnpm prepare
```

### 3. Start Development Server

```bash
pnpm dev
```

Navigate to `http://localhost:3000` to see the app running.

## Development Workflow

### Available Commands

```bash
# Development
pnpm dev              # Start dev server with HMR
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Check for linting issues
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run all tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report

# Preparation
pnpm prepare          # Install Husky hooks (run after git clone)
```

## Project Architecture

### Folder Organization

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page (providers + composition)
│   └── globals.css      # Global styles & theme tokens
│
├── components/          # React components
│   ├── TaskCard.tsx     # Task display with 3D cube
│   ├── TaskForm.tsx     # Add new task form
│   ├── TaskList.tsx     # List container
│   ├── TaskCube.tsx     # Three.js 3D component
│   ├── FilterBar.tsx    # Filter controls
│   ├── Pagination.tsx   # Page navigation
│   ├── ErrorComponent.tsx
│   ├── StarBackground.tsx
│   └── ui/              # shadcn/ui components
│
├── context/             # React Context providers
│   └── TaskContext.tsx  # Task state management
│
├── hooks/               # Custom React hooks
│   ├── useTasks.ts
│   ├── useFilteredTasks.ts
│   └── usePagination.ts
│
├── types/               # TypeScript type definitions
│   └── index.ts
│
├── lib/                 # Utilities and helpers
│   ├── api.ts          # API abstraction
│   └── utils.ts        # General utilities
│
└── __tests__/          # Test files (mirrors src structure)
    ├── hooks/
    ├── components/
    └── utils/
```

## State Management

### Context Structure

The app uses **React Context API + Hooks** for state management:

```
TaskContext
├── State
│   ├── tasks: Task[]
│   ├── loading: boolean
│   ├── error: string | null
│   ├── currentPage: number
│   ├── filter: 'all' | 'completed' | 'pending'
│   ├── localTasks: Record<string, Task>
│   └── pendingDeletes: Set<number>
│
└── Actions
    ├── fetchTasks(page)
    ├── retryFetch()
    ├── addTask(title)
    ├── toggleTask(id)
    ├── deleteTask(id)
    ├── setFilter(filter)
    ├── setPage(page)
    └── clearError()
```

### Using Context in Components

```tsx
import { useTasks } from '@/hooks/useTasks';

function MyComponent() {
  const { tasks, loading, error, toggleTask } = useTasks();
  
  return (
    // component JSX
  );
}
```

## API Integration

### DummyJSON Todos API

The app connects to the public DummyJSON API. No authentication required.

**Base URL**: `https://dummyjson.com`

### Endpoints

| Method | Endpoint | Purpose | Notes |
|--------|----------|---------|-------|
| GET | `/todos?limit=10&skip=SKIP` | Fetch tasks | Paginated (10 per page) |
| POST | `/todos/add` | Create task | Returns new task |
| PATCH | `/todos/{id}` | Update task | For completion status |
| DELETE | `/todos/{id}` | Delete task | Removes task |

### Debounce Strategy

Task state changes are debounced for **2-3 seconds**:

```
User clicks "Mark Done"
  ↓
UI updates immediately (optimistic)
  ↓
Timer starts (2-3 seconds)
  ↓
User can click again to change state
  ↓
Timer completes → API call sent
```

This prevents excessive API calls and improves UX.

## Testing

### Test Setup

- **Framework**: Jest + React Testing Library
- **Configuration**: `jest.config.js` + `jest.setup.js`
- **Mocks**: Fetch API, Canvas, requestAnimationFrame

### Test Structure

```bash
__tests__/
├── hooks/
│   ├── useTasks.test.ts
│   └── useFilteredTasks.test.ts
└── components/
    ├── TaskCard.test.tsx
    └── TaskForm.test.tsx
```

### Writing Tests

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskProvider } from '@/context/TaskContext';

const wrapper = ({ children }) => 
  <TaskProvider>{children}</TaskProvider>;

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />, { wrapper });
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run specific test file
pnpm test --testNamePattern="TaskCard"
```

## Code Quality

### ESLint

Configuration: `.eslintrc.json`

```bash
# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

**Rules**:
- React hooks rules enforced
- No unused variables (warn)
- TypeScript strict mode enabled

### Prettier

Configuration: `.prettierrc.json`

```bash
# Format all files
pnpm format

# Auto-format on save (recommended in IDE)
```

**Settings**:
- 2-space indentation
- Single quotes
- Trailing commas (ES5)
- 100-character line width

### Pre-commit Hooks (Husky + Lint-staged)

Automatically runs before commits:
1. ESLint fix
2. Prettier format
3. Jest tests (optional)

Configuration: `.lintstagedrc.json`

Files are auto-fixed and re-staged if changes are made.

## 3D Animation Details

### TaskCube Component

Each task displays a rotating 3D cube powered by React Three Fiber:

```tsx
// Completed task: Green cube
// Pending task: Gray cube
// Deleting: Dissolve animation with opacity fade
```

**Features**:
- Auto-rotating with lighting
- Color interpolation on state change
- Smooth dissolve on deletion
- OrbitControls for interactivity

### StarBackground Component

Animated star field rendered with Three.js:

```tsx
// 500 randomly positioned stars
// Parallax effect with camera movement
// Ambient lighting for depth
```

**Performance**:
- Uses Points geometry for efficiency
- Buffer attributes for large geometry
- Single canvas for background

## Design System

### Color Tokens

See `app/globals.css` for complete token list:

```css
--primary: oklch(0.65 0.17 251)      /* Indigo */
--accent: oklch(0.58 0.15 163)       /* Cyan */
--background: oklch(0.98 0.001 221)  /* Off-white */
--foreground: oklch(0.1 0.001 221)   /* Dark navy */
```

### Responsive Design

Mobile-first approach with Tailwind breakpoints:

```tsx
<div className="flex gap-2 md:gap-4 lg:gap-6">
  // Mobile: 8px gap
  // Tablet: 16px gap
  // Desktop: 24px gap
</div>
```

### Layout Patterns

Use flexbox by default:

```tsx
<div className="flex items-center justify-between gap-4">
  // Horizontal layout
</div>
```

Grid only for complex 2D layouts.

## Performance Tips

1. **Filtering**: Done client-side with `useFilteredTasks` hook
2. **Memoization**: Filtered tasks use `useMemo` to prevent re-renders
3. **Debouncing**: API calls debounced on state changes
4. **Code Splitting**: Components lazy-loaded by Next.js
5. **Image Optimization**: Use Next.js Image component when needed

## Troubleshooting

### Canvas/Three.js Not Rendering

**Issue**: Black squares instead of 3D cubes

**Solution**:
1. Check browser console for WebGL errors
2. Ensure hardware acceleration is enabled
3. Update graphics drivers
4. Try in a different browser

### Tests Failing

**Issue**: `Cannot find module` errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm test
```

### Port 3000 Already in Use

**Solution**:
```bash
# Use different port
pnpm dev -- -p 3001
```

### Husky Hooks Not Running

**Solution**:
```bash
# Reinstall Husky
rm -rf .husky
pnpm prepare
```

## Deployment

### Vercel (Recommended)

```bash
# Connect your repo to Vercel dashboard
# Auto-deploys on push to main
```

### Self-hosted

```bash
# Build
pnpm build

# Start production server
pnpm start

# Or use PM2
pm2 start pnpm --name "task-flow" -- start
```

## Environment Variables

Create `.env.local` (copy from `.env.example`):

```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

No authentication required for DummyJSON public API.

## Git Workflow

### Commit Flow

```bash
git add .
git commit -m "feat: add task deletion"
# Husky runs pre-commit checks
# Lint-staged auto-fixes files
# Jest tests run (if configured)
```

### Branch Naming

```
feat/task-deletion
fix/api-error-handling
docs/add-setup-guide
refactor/context-structure
```

## IDE Configuration

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "unifiedjs.vscode-mdx",
    "orta.vscode-jest"
  ]
}
```

### VS Code Settings

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Next Steps

1. **Run the dev server**: `pnpm dev`
2. **Explore the UI**: Visit `http://localhost:3000`
3. **Read the code**: Start with `app/page.tsx`
4. **Run tests**: `pnpm test:watch`
5. **Make changes**: Edit components and see HMR in action
6. **Commit changes**: Git hooks will validate your code

## Additional Resources

- [Next.js 16 Docs](https://nextjs.org)
- [React 19 Docs](https://react.dev)
- [Three.js Docs](https://threejs.org)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Docs](https://www.typescriptlang.org)

---

Happy coding! 🚀

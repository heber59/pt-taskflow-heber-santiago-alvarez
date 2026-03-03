# Quick Start Guide

## 30-Second Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Initialize hooks
pnpm prepare

# 3. Start dev server
pnpm dev

# 4. Open http://localhost:3000
```

That's it! The app is running.

## Common Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm lint             # Check code quality
pnpm format           # Format code
pnpm test             # Run tests

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Git & Pre-commit
pnpm prepare          # Setup Husky hooks (after git clone)
```

## Project Layout

```
components/          → UI components
  ├── TaskCard.tsx  → Individual task
  ├── TaskForm.tsx  → Add new task
  └── TaskList.tsx  → Task list
context/            → Global state
hooks/              → Custom hooks
types/              → TypeScript types
__tests__/          → Test files
```

## Core Features

✅ Create, read, update, delete tasks  
✅ Pagination (10 tasks per page)  
✅ Filter by status (all/completed/pending)  
✅ 3D cube animations per task  
✅ Animated star background  
✅ Real-time API integration  
✅ Error handling with retry  

## Using the App

1. **Add a Task**: Type in the input field and click the + button
2. **Mark Complete**: Click "Mark Done" button on any task
3. **Delete**: Click the trash icon (shows "Deleting..." while processing)
4. **Filter**: Click All, Pending, or Completed tabs
5. **Paginate**: Use Previous/Next buttons (10 tasks per page)

## API Information

- **API**: DummyJSON Todos API (public, no key needed)
- **Base URL**: https://dummyjson.com
- **Endpoints**: `/todos` (GET), `/todos/add` (POST), `/todos/{id}` (PATCH/DELETE)
- **Updates**: Debounced 2-3 seconds before server sync

## Code Examples

### Access Task State
```tsx
import { useTasks } from '@/hooks/useTasks';

function MyComponent() {
  const { tasks, loading, toggleTask } = useTasks();
  
  return (
    <div>
      {tasks.map(task => (
        <button key={task.id} onClick={() => toggleTask(task.id)}>
          {task.todo}
        </button>
      ))}
    </div>
  );
}
```

### Create New Task
```tsx
const { addTask } = useTasks();

const handleAdd = () => {
  addTask('Buy groceries');
};
```

### Get Filtered Tasks (No Extra API Calls!)
```tsx
import { useFilteredTasks } from '@/hooks/useFilteredTasks';

function TaskList() {
  const filteredTasks = useFilteredTasks(); // Already filtered based on current filter setting
  return <>{filteredTasks.map(task => ...)}</>;
}
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test TaskCard

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

## Troubleshooting

### Port 3000 is busy
```bash
pnpm dev -- -p 3001
```

### Dependencies not installed
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Husky hooks not working
```bash
pnpm prepare
```

### 3D cubes not showing
- Check browser console for WebGL errors
- Try a different browser
- Ensure GPU acceleration is enabled

## File Editing

### To modify the main page
Edit: `app/page.tsx`

### To add a new component
1. Create: `components/MyComponent.tsx`
2. Import in: `app/page.tsx` or parent component
3. Add tests: `__tests__/components/MyComponent.test.tsx`

### To change colors/styling
Edit: `app/globals.css` (design tokens section)

### To modify API calls
Edit: `lib/api.ts`

### To change state management
Edit: `context/TaskContext.tsx`

## Documentation

- **README.md** - Full feature overview
- **SETUP.md** - Detailed development guide
- **PROJECT_SUMMARY.md** - Complete architecture overview

## Next Steps

1. **Explore**: Run `pnpm dev` and try the app
2. **Modify**: Edit a component and see hot reload
3. **Test**: Run `pnpm test` to see test examples
4. **Build**: Run `pnpm build` for production
5. **Deploy**: Push to GitHub and connect to Vercel

## Tech Stack Summary

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **3D**: Three.js, React Three Fiber
- **State**: React Context + Hooks
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint, Prettier, Husky

## Support

For detailed information, see:
- Full docs in README.md
- Setup instructions in SETUP.md
- Architecture details in PROJECT_SUMMARY.md

---

**Ready to start? Run `pnpm install && pnpm prepare && pnpm dev`** 🚀

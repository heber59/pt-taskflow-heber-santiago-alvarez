# Task Flow - Real-Time Task Management

A modern, fully-featured task management application built with Next.js 16, React 19, and Three.js. Features real-time state management, 3D animations, and a beautiful dark-themed UI.

## Features

### Core Functionality

- **CRUD Operations**: Create, read, update, and delete tasks seamlessly
- **Real-time API Integration**: Consumes DummyJSON Todos API for all operations
- **Smart Filtering**: Filter tasks by All, Completed, or Pending status without extra API calls
- **Optimistic Updates**: Immediate UI updates with debounced server sync (2-3 seconds)

### Advanced Features

- **3D Animations**: Interactive Three.js cubes representing each task
  - Color transitions: Gray (pending) → Green (completed)
  - Dissolve animations on task deletion
  - Auto-rotating cube with lighting effects
- **Animated Star Background**: Parallax star field using React Three Fiber
- **Error Handling**: Graceful error states with retry functionality
- **Local State Management**: Context API with React hooks for clean, maintainable code
- **Debounced Updates**: Task state changes wait 2-3 seconds before syncing to prevent unnecessary API calls

### Developer Experience

- **TypeScript**: Full type safety across the application
- **Jest + React Testing Library**: Comprehensive test coverage for hooks and components
- **ESLint + Prettier**: Code quality and consistent formatting
- **Husky + Lint-Staged**: Pre-commit hooks for automated code validation
- **Component Architecture**: Organized, reusable components with clear separation of concerns

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with provider wrapper
│   └── globals.css         # Global styles with design tokens
├── components/
│   ├── TaskCard.tsx        # Individual task display with actions
│   ├── TaskCube.tsx        # Three.js 3D cube component
│   ├── TaskForm.tsx        # Add new task form
│   ├── TaskList.tsx        # Task list container
│   ├── FilterBar.tsx       # Filter controls (All/Completed/Pending)
│ │   ├── ErrorComponent.tsx  # Error state with retry
│   └── StarBackground.tsx  # Animated 3D star background
├── context/
│   └── TaskContext.tsx     # Global state management with Task operations
├── hooks/
│   ├── useTasks.ts         # Access task context
│   ├── useFilteredTasks.ts # Get filtered tasks without extra API calls
│   ├── useTaskForm.ts      # Add task form logic
│   └── useStarBackground.ts # Star field state and scroll handling
│ ├── types/
│   └── index.ts            # TypeScript interfaces and types
├── __tests__/
│   ├── hooks/
│   │   ├── useTasks.test.ts
│   │   └── useFilteredTasks.test.ts
│   └── components/
│       ├── TaskCard.test.tsx
│       └── TaskForm.test.tsx
└── Configuration files
    ├── jest.config.js      # Jest testing configuration
    ├── jest.setup.js       # Jest setup and mocks
    ├── .eslintrc.json      # ESLint rules
    ├── .prettierrc.json    # Prettier formatting
    ├── .lintstagedrc.json  # Lint-staged pre-commit
    └── .husky/             # Husky git hooks
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Initialize Husky
pnpm prepare
```

### Development

```bash
# Start dev server
pnpm dev

# Run linter
pnpm lint
pnpm lint:fix

# Format code
pnpm format

# Run tests
pnpm test
pnpm test:watch
pnpm test:coverage
```

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## API Integration

The app integrates with the **DummyJSON Todos API**:

### Endpoints Used

- **GET** `/todos?limit=10&skip=SKIP` - Fetch paginated tasks
- **POST** `/todos/add` - Create new task
- **PATCH** `/todos/{id}` - Update task completion status
- **DELETE** `/todos/{id}` - Delete task

### Debounce Strategy

Task completion updates are debounced for 2-3 seconds to:

1. Allow users to change their mind before sending to server
2. Prevent excessive API calls for rapid state changes
3. Improve perceived performance with instant UI feedback

### Local State Management

- New tasks are stored locally before API confirmation
- Task state changes (completed/pending) are reflected immediately in the UI
- Pending deletes show a "Deleting..." indicator
- Failed API calls trigger error states with retry buttons

## Design System

### Color Palette

- **Primary**: Indigo (oklch(0.65 0.17 251)) - Main actions and accents
- **Accent**: Cyan (oklch(0.58 0.15 163)) - Secondary highlights
- **Background**: Off-white (oklch(0.98 0.001 221)) - Clean, modern look
- **Foreground**: Dark Navy (oklch(0.1 0.001 221)) - High contrast text
- **Status Colors**:
  - Green (0x22c55e) for completed tasks
  - Gray (0x9ca3af) for pending tasks
  - Red for destructive actions

### Typography

- **Font**: Geist (system default)
- **Line Height**: 1.4-1.6 for readability
- **Scale**: Semantic sizing with Tailwind classes

### Responsive Design

- Mobile-first approach
- Flexbox-based layouts
- Optimized for all screen sizes
- Touch-friendly button sizing

## Testing

### Test Coverage

- **Hooks**: `useTasks`, `useFilteredTasks`, `useTaskForm`, `useStarBackground`
- **Components**: `TaskCard`, `TaskForm`, `TaskList`, `FilterBar`
- **Integration**: Context provider integration, API interactions
- **Mocks**: Fetch API, Canvas/Three.js for unit tests

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Performance Optimizations

1. **Client-side Filtering**: No extra API calls for filters
2. **Debounced Updates**: 2-3 second debounce on state changes
3. **Optimistic UI**: Immediate feedback with server sync later
4. **Component Memoization**: Filtered tasks computed with useMemo
5. **Lazy Loading**: Three.js/React Three Fiber canvas mounts only when needed

## Browser Support

- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires WebGL for 3D animations

## Dependencies

### Core

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **Lucide React** - Beautiful icons

### 3D & Animation

- **Three.js r128** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Utilities for R3F

### Form & Validation

- **React Hook Form** - Efficient forms
- **Zod** - TypeScript-first validation

### State Management

- **Context API** - Built-in React state management
- **React Hooks** - Stateful logic extraction

### Development

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Lint-staged** - Pre-commit linting

## Environment Variables

Currently, no environment variables are required. The app uses the public DummyJSON API.

For production deployment, consider adding:

- `NEXT_PUBLIC_API_URL` - Custom API endpoint
- `API_SECRET` - API authentication (if needed)

## Known Limitations

1. **API Responses**: DummyJSON API returns mocked responses, so POST/PATCH/DELETE don't persist
2. **Local-only Persistence**: Task changes persist in-session only
3. **Maximum Tasks**: Limited to 30 tasks at a time (3 pages × 10 items)

## Future Enhancements

- [ ] Local storage persistence for session recovery
- [ ] Real backend integration with proper authentication
- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Collaborative editing
- [ ] Dark/light theme toggle
- [ ] Mobile app with Expo
- [ ] Search functionality
- [ ] Bulk operations
- [ ] Task duplication

## License

MIT - Feel free to use this project for learning and personal projects.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js, React, and Three.js

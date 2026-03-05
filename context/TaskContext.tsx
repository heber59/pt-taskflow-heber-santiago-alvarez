'use client';

// deprecated entry point kept for compatibility
// forwards everything to the new `context/tasks` module
export { TaskProvider, TaskContext } from './tasks/TaskContext';
export { useTasks } from './tasks';

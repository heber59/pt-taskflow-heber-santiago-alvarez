import { Task } from './Task';
import { FilterType } from './FilterType';

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  filter: FilterType;
  localTasks: Record<string, Task>; // Track local state changes
  pendingDeletes: Set<number>; // Track pending deletions
  isInitialized: boolean;
  
  // Actions
  fetchTasks: (page: number) => Promise<void>;
  retryFetch: () => Promise<void>;
  addTask: (title: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => Promise<void>;
  setFilter: (filter: FilterType) => void;
  setPage: (page: number) => void;
  clearError: () => void;
}

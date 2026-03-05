import { Task } from './Task';
import { FilterType } from './FilterType';

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
  localTasks: Record<string, Task>;
  pendingDeletes: Set<number>;
  isInitialized: boolean;

  fetchTasks: (page: number) => Promise<void>;
  retryFetch: () => Promise<void>;
  addTask: (title: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => Promise<void>;
  setFilter: (filter: FilterType) => void;
  clearError: () => void;
}

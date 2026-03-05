import { ITask } from './Task';
import { IFilterType } from './FilterType';

interface ITaskContextType {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
  filter: IFilterType;
  localTasks: Record<string, ITask>;
  pendingDeletes: Set<number>;
  isInitialized: boolean;

  fetchTasks: (page: number) => Promise<void>;
  retryFetch: () => Promise<void>;
  addTask: (title: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => Promise<void>;
  setFilter: (filter: IFilterType) => void;
  clearError: () => void;
}
export type { ITaskContextType };

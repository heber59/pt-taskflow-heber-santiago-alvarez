export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  localId?: string; // For tracking newly created tasks
}

export interface TasksResponse {
  todos: Task[];
  total: number;
  skip: number;
  limit: number;
}

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  filter: 'all' | 'completed' | 'pending';
  localTasks: Record<string, Task>; // Track local state changes
  pendingDeletes: Set<number>; // Track pending deletions
  
  // Actions
  fetchTasks: (page: number) => Promise<void>;
  retryFetch: () => Promise<void>;
  addTask: (title: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => Promise<void>;
  setFilter: (filter: 'all' | 'completed' | 'pending') => void;
  setPage: (page: number) => void;
  clearError: () => void;
}

export interface TaskState extends Task {
  isLoading?: boolean;
  isSynced?: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

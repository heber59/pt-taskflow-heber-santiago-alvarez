// Hook Types - For hook-related type definitions

import { Task } from './Task';

export interface PersistedState {
  tasks: Task[];
  localTasks: Record<string, Task>;
  pendingDeletes: number[];
}

export type FormValues = {
  todo: string;
};

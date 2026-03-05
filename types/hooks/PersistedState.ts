import { Task } from '@/types';

interface IPersistedState {
  tasks: Task[];
  localTasks: Record<string, Task>;
  pendingDeletes: number[];
}
export type { IPersistedState };

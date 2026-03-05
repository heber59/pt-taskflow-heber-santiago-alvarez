import { ITask } from '@/types';

interface IPersistedState {
  tasks: ITask[];
  localTasks: Record<string, ITask>;
  pendingDeletes: number[];
}
export type { IPersistedState };

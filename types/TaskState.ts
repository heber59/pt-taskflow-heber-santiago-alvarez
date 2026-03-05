import { ITask } from '@/types';

interface ITaskState extends ITask {
  isLoading?: boolean;
  isSynced?: boolean;
}

export type { ITaskState };

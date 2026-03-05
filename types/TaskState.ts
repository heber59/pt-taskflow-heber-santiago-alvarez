import { Task } from './Task';

export interface TaskState extends Task {
  isLoading?: boolean;
  isSynced?: boolean;
}

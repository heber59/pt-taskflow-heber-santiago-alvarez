import { ITask } from '@/types';

interface ITasksResponse {
  todos: ITask[];
  total: number;
  skip: number;
  limit: number;
}
export type { ITasksResponse };

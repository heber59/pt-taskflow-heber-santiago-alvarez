import { Task } from './Task';

export interface TasksResponse {
  todos: Task[];
  total: number;
  skip: number;
  limit: number;
}

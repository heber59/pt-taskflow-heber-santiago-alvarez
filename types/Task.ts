export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  localId?: string; // For tracking newly created tasks
}

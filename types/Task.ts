export interface ITask {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  localId?: string;
}

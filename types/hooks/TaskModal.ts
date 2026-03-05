import { Task } from '@/types';

interface IUseTaskModal {
  task: Task;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}
export type { IUseTaskModal };

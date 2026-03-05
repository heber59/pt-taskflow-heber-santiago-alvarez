import { ITask } from '@/types';

interface IUseTaskModal {
  task: ITask | null;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}
export type { IUseTaskModal };

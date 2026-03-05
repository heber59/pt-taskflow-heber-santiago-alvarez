import { useMemo } from 'react';
import { useTasks } from '@/context/tasks/TaskContext';
import { IFilterType } from '@/types';

export function useFilteredTasks() {
  const { tasks, filter } = useTasks();

  return useMemo(() => {
    switch (filter) {
      case IFilterType.COMPLETED:
        return tasks.filter((t) => t.completed);
      case IFilterType.PENDING:
        return tasks.filter((t) => !t.completed);
      case IFilterType.ALL:
      default:
        return tasks;
    }
  }, [tasks, filter]);
}

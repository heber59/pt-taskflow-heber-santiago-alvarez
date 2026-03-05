import { useMemo } from 'react';
import { useTasks } from '@/context/tasks/TaskContext';
import { FilterType } from '@/types';

export function useFilteredTasks() {
  const { tasks, filter } = useTasks();

  return useMemo(() => {
    switch (filter) {
      case FilterType.COMPLETED:
        return tasks.filter((t) => t.completed);
      case FilterType.PENDING:
        return tasks.filter((t) => !t.completed);
      case FilterType.ALL:
      default:
        return tasks;
    }
  }, [tasks, filter]);
}

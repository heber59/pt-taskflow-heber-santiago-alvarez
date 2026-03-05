'use client';

import { useMemo } from 'react';
import { Task } from '@/types';
import { useTasks } from '@/context/tasks';
import { FilterType } from '@/types';

// Returns the list of tasks filtered according to the current filter value
// Memoized to avoid unnecessary recalculations on unrelated state changes.
export function useFilteredTasks(): Task[] {
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

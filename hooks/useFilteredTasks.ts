'use client';

import { useMemo } from 'react';
import { useTasks } from './useTasks';
import { Task } from '@/types';

export function useFilteredTasks() {
  const { tasks, filter, pendingDeletes } = useTasks();

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Exclude pending deletes
        if (pendingDeletes.has(task.id)) return false;

        // Apply filter
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
      })
      .sort((a, b) => {
        // New tasks first, then by id
        if (a.localId && !b.localId) return -1;
        if (!a.localId && b.localId) return 1;
        return b.id - a.id;
      });
  }, [tasks, filter, pendingDeletes]);

  return filteredTasks;
}

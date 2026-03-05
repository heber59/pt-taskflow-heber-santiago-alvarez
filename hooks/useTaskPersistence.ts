import { useEffect, useRef } from 'react';
import { Task, PersistedState } from '@/types';

const STORAGE_KEYS = {
  tasks: 'taskflow_tasks',
  localTasks: 'taskflow_localTasks',
  pendingDeletes: 'taskflow_pendingDeletes',
} as const;

export function loadPersistedState(): PersistedState {
  try {
    return {
      tasks: JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) ?? '[]'),
      localTasks: JSON.parse(localStorage.getItem(STORAGE_KEYS.localTasks) ?? '{}'),
      pendingDeletes: JSON.parse(localStorage.getItem(STORAGE_KEYS.pendingDeletes) ?? '[]'),
    };
  } catch {
    return { tasks: [], localTasks: {}, pendingDeletes: [] };
  }
}

export function useTaskPersistence(
  tasks: Task[],
  localTasks: Record<string, Task>,
  pendingDeletes: Set<number>,
  isInitialized: boolean
) {
  const tasksRef = useRef(tasks);
  const localTasksRef = useRef(localTasks);
  const pendingDeletesRef = useRef(pendingDeletes);

  tasksRef.current = tasks;
  localTasksRef.current = localTasks;
  pendingDeletesRef.current = pendingDeletes;

  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasksRef.current));
    localStorage.setItem(STORAGE_KEYS.localTasks, JSON.stringify(localTasksRef.current));
    localStorage.setItem(
      STORAGE_KEYS.pendingDeletes,
      JSON.stringify(Array.from(pendingDeletesRef.current))
    );
  }, [tasks, localTasks, pendingDeletes, isInitialized]);
}

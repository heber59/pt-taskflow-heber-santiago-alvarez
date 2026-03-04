'use client';

import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Task, TaskContextType, TasksResponse, FilterType } from 'types';
import { API } from '@lib/api';

export const TaskContext = createContext<TaskContextType | null>(null);

const ITEMS_PER_PAGE = 30; // Load more tasks for the star background

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [localTasks, setLocalTasks] = useState<Record<string, Task>>({});
  const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);
  const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('taskflow_tasks');
      const storedLocalTasks = localStorage.getItem('taskflow_localTasks');
      const storedPendingDeletes = localStorage.getItem('taskflow_pendingDeletes');

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedLocalTasks) setLocalTasks(JSON.parse(storedLocalTasks));
      if (storedPendingDeletes) setPendingDeletes(new Set(JSON.parse(storedPendingDeletes)));
    } catch (err) {
      console.error('Failed to load local state', err);
    }

    setIsInitialized(true);
  }, []);

  // 2. Persist to LocalStorage on Change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('taskflow_localTasks', JSON.stringify(localTasks));
      localStorage.setItem('taskflow_pendingDeletes', JSON.stringify(Array.from(pendingDeletes)));
    }
  }, [tasks, localTasks, pendingDeletes, isInitialized]);

  // Fetch tasks from API (Background Sync)
  const fetchTasks = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * ITEMS_PER_PAGE;

      const data: TasksResponse = await API.fetchTasks(ITEMS_PER_PAGE, skip);

      // Merge local changes with fetched data
      const mergedTasks = data.todos.map(task =>
        localTasks[task.id] ? { ...task, ...localTasks[task.id] } : task
      );

      // Add purely local tasks that haven't been synced to the top
      const localOnlyTasks = Object.values(localTasks).filter(t => !data.todos.find(dt => dt.id === t.id));

      setTasks([...localOnlyTasks, ...mergedTasks]);
      setCurrentPage(page);
    } catch (err) {
      console.error('Background sync failed, relying on local storage', err);
      // We don't set a hard error here since we are local-first, just warn
    } finally {
      setLoading(false);
    }
  }, [localTasks]);

  // Retry fetch
  const retryFetch = useCallback(async () => {
    await fetchTasks(currentPage);
  }, [fetchTasks, currentPage]);

  // Add new task locally
  const addTask = useCallback((title: string) => {
    const newTask: Task = {
      id: Date.now(),
      todo: title,
      completed: false,
      userId: 1,
      localId: `local_${Date.now()}`,
    };

    setLocalTasks(prev => ({
      ...prev,
      [newTask.id]: newTask,
    }));

    setTasks(prev => [newTask, ...prev]);

    // Post to API (Optimistic Background Sync)
    (async () => {
      try {
        await API.addTask(title, 1);
        // API response is mocked, keep local version as source of truth
      } catch (err) {
        console.error('Error syncing new task in background:', err);
      }
    })();
  }, []);

  // Toggle task completion with debounced PATCH
  const toggleTask = useCallback((id: number) => {
    const isCompleted = !tasks.find(t => t.id === id)?.completed;

    // Update local state immediately
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: isCompleted } : task
    ));

    setLocalTasks(prev => {
      const existing = prev[id] || tasks.find(t => t.id === id);
      if (!existing) return prev;
      return {
        ...prev,
        [id]: { ...existing, completed: isCompleted },
      };
    });

    if (debounceTimersRef.current[id]) {
      clearTimeout(debounceTimersRef.current[id]);
    }

    debounceTimersRef.current[id] = setTimeout(async () => {
      try {
        await API.updateTask(id, isCompleted);
      } catch (err) {
        console.error('Error syncing task toggle in background:', err);
      }
    }, 2500);
  }, [tasks]);

  // Delete task
  const deleteTask = useCallback(async (id: number) => {
    // Optimistically mark as pending delete and remove from local UI
    setPendingDeletes(prev => new Set([...prev, id]));
    setTasks(prev => prev.filter(task => task.id !== id));

    setLocalTasks(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    try {
      await API.deleteTask(id);

      setPendingDeletes(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    } catch (err) {
      console.error('Delete sync failed:', err);
      // Wait to re-add it or keep it deleted locally? We chose local-first, so it stays deleted locally.
      setPendingDeletes(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  }, []);

  // Initial fetch after hydration
  useEffect(() => {
    if (isInitialized) {
      fetchTasks(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    currentPage,
    filter,
    localTasks,
    pendingDeletes,
    isInitialized,
    fetchTasks,
    retryFetch,
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
    setPage: setCurrentPage,
    clearError: () => setError(null),
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

import { useCallback, useEffect, useState } from 'react';
import { Task, FilterType } from '@/types';
import { loadPersistedState, useTaskPersistence } from '@/hooks/useTaskPersistence';
import { useTaskApi } from '@/hooks/useTaskApi';

const ITEMS_PER_PAGE = 30;

export function useTaskState() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [localTasks, setLocalTasks] = useState<Record<string, Task>>({});
  const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [isInitialized, setIsInitialized] = useState(false);

  const api = useTaskApi();
  useTaskPersistence(tasks, localTasks, pendingDeletes, isInitialized);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const saved = loadPersistedState();
    if (saved.tasks.length) setTasks(saved.tasks);
    if (Object.keys(saved.localTasks).length) setLocalTasks(saved.localTasks);
    if (saved.pendingDeletes.length) setPendingDeletes(new Set(saved.pendingDeletes));
    setIsInitialized(true);
  }, []);

  const fetchTasks = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);
        const merged = await api.fetchPage(page, ITEMS_PER_PAGE, localTasks);
        setTasks(merged);
        setCurrentPage(page);
      } catch (err) {
        console.error('Background sync failed, relying on local storage', err);
      } finally {
        setLoading(false);
      }
    },
    [api, localTasks]
  );

  // Initial fetch after hydration
  useEffect(() => {
    if (isInitialized) fetchTasks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const addTask = useCallback(
    (title: string) => {
      const newTask: Task = {
        id: Date.now(),
        todo: title,
        completed: false,
        userId: 1,
        localId: `local_${Date.now()}`,
      };

      setLocalTasks((prev) => ({ ...prev, [newTask.id]: newTask }));
      setTasks((prev) => [newTask, ...prev]);
      api.syncNewTask(title);
    },
    [api]
  );

  const toggleTask = useCallback(
    (id: number) => {
      const isCompleted = !tasks.find((t) => t.id === id)?.completed;

      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: isCompleted } : t)));
      setLocalTasks((prev) => {
        const existing = prev[id] ?? tasks.find((t) => t.id === id);
        if (!existing) return prev;
        return { ...prev, [id]: { ...existing, completed: isCompleted } };
      });

      api.syncToggle(id, isCompleted);
    },
    [api, tasks]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      setPendingDeletes((prev) => new Set([...prev, id]));
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setLocalTasks((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      await api.syncDelete(id);

      setPendingDeletes((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    },
    [api]
  );

  return {
    tasks,
    loading,
    error,
    currentPage,
    filter,
    localTasks,
    pendingDeletes,
    isInitialized,
    fetchTasks,
    retryFetch: () => fetchTasks(currentPage),
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
    setPage: setCurrentPage,
    clearError: () => setError(null),
  };
}

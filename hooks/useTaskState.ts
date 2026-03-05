import { useCallback, useEffect, useState } from 'react';
import { ITask, IFilterType } from '@/types';
import { loadPersistedState, useTaskPersistence } from '@/hooks/useTaskPersistence';
import { useTaskApi } from '@/hooks/useTaskApi';
import { enviroment } from '@/config/enviroment/enviroment';
import { useFlag } from '@/components/FlagProvider';

export function useTaskState() {
  const { addFlag } = useFlag();

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [localTasks, setLocalTasks] = useState<Record<string, ITask>>({});
  const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<IFilterType>(IFilterType.ALL);
  const [isInitialized, setIsInitialized] = useState(false);

  const api = useTaskApi({ addFlag });
  useTaskPersistence(tasks, localTasks, pendingDeletes, isInitialized);

  useEffect(() => {
    const saved = loadPersistedState();
    if (saved.tasks.length) setTasks(saved.tasks);
    if (Object.keys(saved.localTasks).length) setLocalTasks(saved.localTasks);
    if (saved.pendingDeletes.length) setPendingDeletes(new Set(saved.pendingDeletes));
    setIsInitialized(true);
  }, []);
  console.log(enviroment);
  const fetchTasks = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);
        const merged = await api.fetchPage(page, enviroment.ITEMS_PER_PAGE, localTasks);
        setTasks(merged);
      } catch (err) {
        console.error('Background sync failed, relying on local storage', err);
        setError('Failed to fetch tasks from server. Showing local data.');
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
      const newTask: ITask = {
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
    filter,
    localTasks,
    pendingDeletes,
    isInitialized,
    fetchTasks,
    retryFetch: () => fetchTasks(1),
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
    clearError: () => setError(null),
  };
}

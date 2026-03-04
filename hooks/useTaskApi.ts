import { useCallback, useRef } from 'react';
import { Task, TasksResponse } from 'types';
import { API } from '@lib/api';

const DEBOUNCE_MS = 2500;

export function useTaskApi() {
  const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});

  const fetchPage = useCallback(
    async (
      page: number,
      itemsPerPage: number,
      localTasks: Record<string, Task>
    ): Promise<Task[]> => {
      const skip = (page - 1) * itemsPerPage;
      const data: TasksResponse = await API.fetchTasks(itemsPerPage, skip);

      const merged = data.todos.map((task) =>
        localTasks[task.id] ? { ...task, ...localTasks[task.id] } : task
      );

      const localOnly = Object.values(localTasks).filter(
        (t) => !data.todos.find((dt) => dt.id === t.id)
      );

      return [...localOnly, ...merged];
    },
    []
  );

  const syncNewTask = useCallback(async (title: string) => {
    try {
      await API.addTask(title, 1);
    } catch (err) {
      console.error('Error syncing new task in background:', err);
    }
  }, []);

  const syncToggle = useCallback((id: number, isCompleted: boolean) => {
    clearTimeout(debounceTimersRef.current[id]);

    debounceTimersRef.current[id] = setTimeout(async () => {
      try {
        await API.updateTask(id, isCompleted);
      } catch (err) {
        console.error('Error syncing task toggle in background:', err);
      }
    }, DEBOUNCE_MS);
  }, []);

  const syncDelete = useCallback(async (id: number) => {
    try {
      await API.deleteTask(id);
    } catch (err) {
      console.error('Delete sync failed:', err);
    }
  }, []);

  return { fetchPage, syncNewTask, syncToggle, syncDelete };
}

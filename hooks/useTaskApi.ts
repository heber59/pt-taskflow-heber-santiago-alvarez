import { useCallback, useRef } from 'react';
import { Task, TasksResponse } from '@/types';
import { API } from '@lib/api';
import { enviroment } from '@/config/enviroment/enviroment';
import { IUseTaskApi } from '@/types/hooks/TaskApi';

export function useTaskApi(props: IUseTaskApi) {
  const { addFlag } = props;
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
        addFlag(`Task marked as ${isCompleted ? 'completed' : 'pending'}`, 'success');
      } catch (err) {
        addFlag('Failed to update task', 'error');
        console.error('Error syncing task toggle in background:', err);
      }
    }, enviroment.DEBOUNCE_MS);
  }, []);

  const syncDelete = useCallback(async (id: number) => {
    try {
      await API.deleteTask(id);
      addFlag('Star went supernova 💥', 'success');
    } catch (err) {
      addFlag('Failed to delete task', 'error');
      console.error('Delete sync failed:', err);
    }
  }, []);

  return { fetchPage, syncNewTask, syncToggle, syncDelete };
}

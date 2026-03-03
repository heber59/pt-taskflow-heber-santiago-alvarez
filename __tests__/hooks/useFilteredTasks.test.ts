import { renderHook, waitFor } from '@testing-library/react';
import { useFilteredTasks } from '@/hooks/useFilteredTasks';
import { useTasks } from '@/hooks/useTasks';
import { TaskProvider } from '@/context/TaskContext';
import React from 'react';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(TaskProvider, null, children);

describe('useFilteredTasks', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        todos: [
          { id: 1, todo: 'Completed task', completed: true, userId: 1 },
          { id: 2, todo: 'Pending task', completed: false, userId: 1 },
          { id: 3, todo: 'Another completed', completed: true, userId: 1 },
        ],
        total: 3,
        skip: 0,
        limit: 10,
      }),
    });
  });

  it('should return all tasks when filter is "all"', async () => {
    const { result: tasksResult } = renderHook(() => useTasks(), { wrapper });
    const { result: filteredResult } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => {
      expect(filteredResult.current.length).toBe(3);
    });
  });

  it('should filter completed tasks', async () => {
    const { result: tasksResult } = renderHook(() => useTasks(), { wrapper });
    const { result: filteredResult } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => {
      expect(tasksResult.current.tasks.length).toBeGreaterThan(0);
    });

    // Change filter to completed
    tasksResult.current.setFilter('completed');

    await waitFor(() => {
      expect(filteredResult.current.every(t => t.completed)).toBe(true);
      expect(filteredResult.current.length).toBe(2);
    });
  });

  it('should filter pending tasks', async () => {
    const { result: tasksResult } = renderHook(() => useTasks(), { wrapper });
    const { result: filteredResult } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => {
      expect(tasksResult.current.tasks.length).toBeGreaterThan(0);
    });

    // Change filter to pending
    tasksResult.current.setFilter('pending');

    await waitFor(() => {
      expect(filteredResult.current.every(t => !t.completed)).toBe(true);
      expect(filteredResult.current.length).toBe(1);
    });
  });

  it('should exclude pending deletes', async () => {
    const { result: tasksResult } = renderHook(() => useTasks(), { wrapper });
    const { result: filteredResult } = renderHook(() => useFilteredTasks(), { wrapper });

    await waitFor(() => {
      expect(filteredResult.current.length).toBe(3);
    });
  });
});

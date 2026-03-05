import { renderHook, act, waitFor } from '@testing-library/react';
import { TaskProvider } from '@/context/tasks';
import { useTasks } from '@/context/tasks/TaskContext';
import React from 'react';
import { FilterType } from '@/types/FilterType';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(TaskProvider, null, children);

describe('useTasks', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        todos: [{ id: 1, todo: 'Test task', completed: false, userId: 1 }],
        total: 1,
        skip: 0,
        limit: 10,
      }),
    });
  });

  it('should throw error when used outside TaskProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useTasks());
    }).toThrow('useTasks must be used within a TaskProvider');

    consoleSpy.mockRestore();
  });

  it('should initialize with default state', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.tasks).toBeDefined();
      expect(result.current.loading).toBeDefined();
      expect(result.current.error).toBeNull();
    });
  });

  it('should fetch tasks on mount', async () => {
    renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it('should add a new task', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    act(() => {
      result.current.addTask('New task');
    });

    await waitFor(() => {
      expect(result.current.tasks.length).toBeGreaterThan(0);
    });
  });

  it('should toggle task completion', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        todos: [{ id: 1, todo: 'Test task', completed: false, userId: 1 }],
        total: 1,
        skip: 0,
        limit: 10,
      }),
    });

    const { result } = renderHook(() => useTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.tasks.length).toBeGreaterThan(0);
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.toggleTask(taskId);
    });

    await waitFor(() => {
      const task = result.current.tasks.find((t) => t.id === taskId);
      expect(task?.completed).toBe(true);
    });
  });

  it('should set filter', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    act(() => {
      result.current.setFilter(FilterType.COMPLETED);
    });

    expect(result.current.filter).toBe(FilterType.COMPLETED);
  });

  it('should clear error', async () => {
    const { result } = renderHook(() => useTasks(), { wrapper });

    // Simulate an error state
    mockFetch.mockRejectedValue(new Error('Fetch failed'));

    await act(async () => {
      await result.current.retryFetch();
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});

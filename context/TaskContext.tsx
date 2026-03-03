'use client';

import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Task, TaskContextType, TasksResponse } from '@/types';

export const TaskContext = createContext<TaskContextType | null>(null);

const API_BASE = 'https://dummyjson.com/todos';
const ITEMS_PER_PAGE = 10;

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [localTasks, setLocalTasks] = useState<Record<string, Task>>({});
  const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
  const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});

  // Fetch tasks from API
  const fetchTasks = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * ITEMS_PER_PAGE;
      const url = `${API_BASE}?limit=${ITEMS_PER_PAGE}&skip=${skip}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      
      const data: TasksResponse = await response.json();
      
      // Merge local changes with fetched data
      const mergedTasks = data.todos.map(task => 
        localTasks[task.id] ? { ...task, ...localTasks[task.id] } : task
      );
      
      setTasks(mergedTasks);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [localTasks]);

  // Retry fetch
  const retryFetch = useCallback(() => {
    fetchTasks(currentPage);
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

    // Post to API
    (async () => {
      try {
        const response = await fetch(`${API_BASE}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todo: title, completed: false, userId: 1 }),
        });
        
        if (!response.ok) throw new Error('Failed to add task');
        // Keep local version, API response is mocked
      } catch (err) {
        console.error('Error adding task:', err);
        setError('Failed to save task. Please try again.');
      }
    })();
  }, []);

  // Toggle task completion with debounced PATCH
  const toggleTask = useCallback((id: number) => {
    // Update local state immediately
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    setLocalTasks(prev => {
      const existing = prev[id];
      return {
        ...prev,
        [id]: existing
          ? { ...existing, completed: !existing.completed }
          : { ...tasks.find(t => t.id === id)!, completed: !tasks.find(t => t.id === id)!.completed },
      };
    });

    // Clear existing timer
    if (debounceTimersRef.current[id]) {
      clearTimeout(debounceTimersRef.current[id]);
    }

    // Set new debounce timer (2-3 seconds)
    debounceTimersRef.current[id] = setTimeout(async () => {
      try {
        const taskToUpdate = tasks.find(t => t.id === id);
        const completed = localTasks[id]?.completed ?? taskToUpdate?.completed ?? false;
        
        const response = await fetch(`${API_BASE}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !completed }),
        });

        if (!response.ok) throw new Error('Failed to update task');
        // Keep local version, API response is mocked
      } catch (err) {
        console.error('Error updating task:', err);
        setError('Failed to update task. Please try again.');
      }
    }, 2500);
  }, [tasks, localTasks]);

  // Delete task
  const deleteTask = useCallback(async (id: number) => {
    // Optimistically mark as pending delete
    setPendingDeletes(prev => new Set([...prev, id]));

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      // Remove from UI after successful deletion
      setTasks(prev => prev.filter(task => task.id !== id));
      setLocalTasks(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setPendingDeletes(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    } catch (err) {
      setPendingDeletes(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
      setError('Failed to delete task. Please try again.');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTasks(1);
  }, []);

  const value: TaskContextType = {
    tasks,
    loading,
    error,
    currentPage,
    filter,
    localTasks,
    pendingDeletes,
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

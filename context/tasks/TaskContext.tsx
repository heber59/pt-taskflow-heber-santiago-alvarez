'use client';

import React, { createContext, useContext } from 'react';
import { TaskContextType } from '@/types';
import { useTaskState } from '@/hooks/useTaskState';

export const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const value = useTaskState();
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

'use client';

import { useContext } from 'react';
import { TaskContext } from '@/context/TaskContext';
import { TaskContextType } from '@/types';

export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

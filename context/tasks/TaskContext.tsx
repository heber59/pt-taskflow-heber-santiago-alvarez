'use client';

import React, { createContext } from 'react';
import { TaskContextType } from '@/types';
import { useTaskState } from '@/hooks/useTaskState';

// context for task state and actions
export const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const value = useTaskState();
    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

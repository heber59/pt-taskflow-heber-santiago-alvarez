'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Task } from '@/types';
import { useTasks } from '@/context/tasks/TaskContext';

export function useStarBackground() {
  const { tasks, filter } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef(0);
  const smoothScrollRef = useRef(0);

  useEffect(() => {
    if (selectedTask) {
      const current = tasks.find((t) => t.id === selectedTask.id);
      if (current) {
        setSelectedTask(current);
      }
    }
  }, [tasks, selectedTask?.id]);

  const visibleTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter((t) => t.completed);
      case 'pending':
        return tasks.filter((t) => !t.completed);
      case 'all':
      default:
        return tasks;
    }
  }, [tasks, filter]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const sensitivity = 1.5;

      scrollRef.current += e.deltaY * sensitivity;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return {
    visibleTasks,
    selectedTask,
    setSelectedTask,
    isModalOpen,
    setIsModalOpen,
    scrollRef,
    smoothScrollRef,
  };
}

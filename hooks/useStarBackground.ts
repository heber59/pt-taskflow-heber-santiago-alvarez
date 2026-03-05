'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Task } from '@/types';
import { useTasks } from '@/context/tasks';

export function useStarBackground() {
  const { tasks, filter } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef(0);
  const smoothScrollRef = useRef(0);

  // keep the selected task reference up to date when the underlying tasks list changes
  useEffect(() => {
    if (selectedTask) {
      const current = tasks.find((t) => t.id === selectedTask.id);
      if (current) {
        setSelectedTask(current);
      }
    }
  }, [tasks, selectedTask?.id]);

  // filter the tasks according to the current filter value
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

  // wheel handling logic extracted from component
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const maxDelta = 120;
      const clampedDelta = Math.max(-maxDelta, Math.min(maxDelta, e.deltaY));
      scrollRef.current += clampedDelta * 0.08;
      scrollRef.current = THREE.MathUtils.clamp(scrollRef.current, -10, 10);
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

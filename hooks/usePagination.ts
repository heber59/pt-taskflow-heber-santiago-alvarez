'use client';

import { useTasks } from '@/context/tasks';

const ITEMS_PER_PAGE = 10;

export function usePagination() {
  const { currentPage, setPage, fetchTasks } = useTasks();

  const goToNextPage = async () => {
    await fetchTasks(currentPage + 1);
  };

  const goToPreviousPage = async () => {
    if (currentPage > 1) {
      await fetchTasks(currentPage - 1);
    }
  };

  const canGoNext = true; // Assuming more pages exist
  const canGoPrevious = currentPage > 1;

  return {
    currentPage,
    canGoNext,
    canGoPrevious,
    goToNextPage,
    goToPreviousPage,
  };
}

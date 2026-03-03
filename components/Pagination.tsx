'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useTasks } from '@/hooks/useTasks';

export function Pagination() {
  const { currentPage, canGoNext, canGoPrevious, goToNextPage, goToPreviousPage } =
    usePagination();
  const { loading } = useTasks();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 flex items-center justify-between gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousPage}
        disabled={!canGoPrevious || loading}
        className="flex items-center gap-2 bg-card border-border hover:bg-secondary disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground font-medium px-4">Page {currentPage}</span>

      <Button
        variant="outline"
        size="sm"
        onClick={goToNextPage}
        disabled={!canGoNext || loading}
        className="flex items-center gap-2 bg-card border-border hover:bg-secondary disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

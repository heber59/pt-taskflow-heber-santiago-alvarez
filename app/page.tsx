'use client';

import { TaskProvider } from '@/context/TaskContext';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { FilterBar } from '@/components/FilterBar';
import { Pagination } from '@/components/Pagination';
import { ErrorComponent } from '@/components/ErrorComponent';
import { StarBackground } from '@/components/StarBackground';
import { useTasks } from '@/hooks/useTasks';
import { Loader2 } from 'lucide-react';

function PageContent() {
  const { error, retryFetch, loading } = useTasks();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <StarBackground />

      <div className="relative z-10 py-12">
        {/* Header */}
        <div className="w-full max-w-2xl mx-auto px-6 mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Task Flow</h1>
          <p className="text-muted-foreground">Manage your tasks with real-time updates</p>
        </div>

        {/* Error State */}
        {error && <ErrorComponent message={error} onRetry={retryFetch} />}

        {/* Main Content */}
        {!error && (
          <>
            {/* Task Form */}
            <TaskForm />

            {/* Filter Bar */}
            <FilterBar />

            {/* Task List */}
            <TaskList />

            {/* Pagination */}
            {!loading && <Pagination />}
          </>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <TaskProvider>
      <PageContent />
    </TaskProvider>
  );
}

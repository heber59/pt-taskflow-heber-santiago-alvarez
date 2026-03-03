'use client';

import { TaskCard } from './TaskCard';
import { useFilteredTasks } from '@/hooks/useFilteredTasks';
import { Loader2 } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

export function TaskList() {
  const filteredTasks = useFilteredTasks();
  const { loading } = useTasks();

  if (loading && filteredTasks.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 flex justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 text-center">
        <p className="text-muted-foreground">No tasks found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-3">
      {filteredTasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

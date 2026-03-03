'use client';

import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import TaskCube from './TaskCube';
import { Card, CardContent } from '@/components/ui/card';

interface TaskCardProps {
  task: Task;
  onStateChange?: () => void;
  onDelete?: () => void;
}

export function TaskCard({ task, onStateChange, onDelete }: TaskCardProps) {
  const { toggleTask, deleteTask, pendingDeletes } = useTasks();
  const isPendingDelete = pendingDeletes.has(task.id);

  const handleToggle = () => {
    toggleTask(task.id);
    onStateChange?.();
  };

  const handleDelete = async () => {
    onDelete?.();
    await deleteTask(task.id);
  };

  return (
    <Card className="relative overflow-hidden bg-card border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* 3D Cube Animation */}
          <div className="w-16 h-16 flex-shrink-0">
            <TaskCube completed={task.completed} isDeleting={isPendingDelete} />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={`text-base font-medium transition-all ${
                    task.completed
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {task.todo}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {task.completed ? '✓ Completed' : '○ Pending'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggle}
                  disabled={isPendingDelete}
                  className={`transition-colors ${
                    task.completed
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  }`}
                >
                  {task.completed ? '✓ Done' : 'Mark Done'}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPendingDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isPendingDelete ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator for pending operations */}
        {isPendingDelete && (
          <div className="absolute inset-0 bg-red-500/5 backdrop-blur-xs flex items-center justify-center">
            <div className="text-xs text-red-600 font-medium">Deleting...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

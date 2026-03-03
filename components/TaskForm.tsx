'use client';

import { useState } from 'react';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTasks } from '@/hooks/useTasks';

export function TaskForm() {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const { addTask } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please enter a task description',
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    try {
      addTask(input.trim());
      setInput('');
      setFeedback({
        type: 'success',
        message: 'Task created successfully!',
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to create task. Please try again.',
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-lg border border-border shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1"
            maxLength={100}
          />
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {feedback && (
          <div
            className={`flex items-center gap-2 p-3 rounded-md text-sm ${
              feedback.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}

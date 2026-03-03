'use client';

import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ListTodo } from 'lucide-react';

export function FilterBar() {
  const { filter, setFilter } = useTasks();

  const filters: Array<{
    value: 'all' | 'completed' | 'pending';
    label: string;
    icon: React.ReactNode;
  }> = [
    { value: 'all', label: 'All Tasks', icon: <ListTodo className="h-4 w-4" /> },
    { value: 'pending', label: 'Pending', icon: <Circle className="h-4 w-4" /> },
    { value: 'completed', label: 'Completed', icon: <CheckCircle className="h-4 w-4" /> },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <Button
            key={f.value}
            variant={filter === f.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.value)}
            className={`flex items-center gap-2 ${
              filter === f.value
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-card border-border hover:bg-secondary'
            }`}
          >
            {f.icon}
            {f.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

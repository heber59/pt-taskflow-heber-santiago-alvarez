'use client';

import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ListTodo } from 'lucide-react';
import { FilterType } from 'types';

export function FilterBar() {
  const { filter, setFilter } = useTasks();

  const filters: Array<{
    value: FilterType;
    label: string;
    icon: React.ReactNode;
    activeColor: string;
  }> = [
      { value: FilterType.ALL, label: 'All Stars', icon: <ListTodo className="h-4 w-4" />, activeColor: 'bg-white text-slate-950 font-bold' },
      { value: FilterType.PENDING, label: 'Pending', icon: <Circle className="h-4 w-4" />, activeColor: 'bg-blue-500 text-white font-bold' },
      { value: FilterType.COMPLETED, label: 'Ignited', icon: <CheckCircle className="h-4 w-4" />, activeColor: 'bg-emerald-500 text-white font-bold' },
    ];

  return (
    <div className="flex gap-2 p-1">
      {filters.map(f => (
        <Button
          key={f.value}
          variant="ghost"
          size="sm"
          onClick={() => setFilter(f.value)}
          className={`relative flex items-center gap-2 rounded-full px-5 h-9 transition-all duration-300 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-white pointer-events-auto ${filter === f.value
              ? f.activeColor
              : 'text-slate-200 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
            }`}
        >
          {f.icon}
          <span className="hidden xs:inline">{f.label}</span>
          {filter === f.value && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
          )}
        </Button>
      ))}
    </div>
  );
}

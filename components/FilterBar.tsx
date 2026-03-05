'use client';

import { Button } from '@/components/ui/button';
import { filtersOptions } from '@/config/filterBar/filterOptions';

import { useTasks } from '@/context/tasks/TaskContext';

export function FilterBar() {
  const { filter, setFilter } = useTasks();

  return (
    <div className="flex gap-2 p-1">
      {filtersOptions.map((option) => (
        <Button
          key={option.value}
          variant="ghost"
          size="sm"
          onClick={() => setFilter(option.value)}
          className={`relative flex items-center gap-2 rounded-full px-5 h-9 transition-all duration-300 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-white pointer-events-auto ${
            filter === option.value
              ? option.activeColor
              : 'text-slate-200 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
          }`}
        >
          {option.icon}
          <span className="">{option.label}</span>
        </Button>
      ))}
    </div>
  );
}

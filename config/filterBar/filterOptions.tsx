import React from 'react';
import { CheckCircle, Circle, ListTodo } from 'lucide-react';
import { FilterType } from '@/types';

const filtersOptions: Array<{
  value: FilterType;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
}> = [
  {
    value: FilterType.ALL,
    label: 'All Stars',
    icon: <ListTodo className="h-4 w-4" />,
    activeColor: 'bg-white text-slate-950 font-bold ',
  },
  {
    value: FilterType.PENDING,
    label: 'Pending',
    icon: <Circle className="h-4 w-4" />,
    activeColor: 'bg-blue-500 text-white font-bold hover:bg-blue-600',
  },
  {
    value: FilterType.COMPLETED,
    label: 'Complete',
    icon: <CheckCircle className="h-4 w-4" />,
    activeColor: 'bg-emerald-500 text-white font-bold hover:bg-emerald-600',
  },
];

export { filtersOptions };

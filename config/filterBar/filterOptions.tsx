import React from 'react';
import { CheckCircle, Circle, ListTodo } from 'lucide-react';
import { IFilterType } from '@/types';

const filtersOptions: Array<{
  value: IFilterType;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
}> = [
  {
    value: IFilterType.ALL,
    label: 'All Stars',
    icon: <ListTodo className="h-4 w-4" />,
    activeColor: 'bg-white text-slate-950 font-bold ',
  },
  {
    value: IFilterType.PENDING,
    label: 'Pending',
    icon: <Circle className="h-4 w-4" />,
    activeColor: 'bg-blue-500 text-white font-bold hover:bg-blue-600',
  },
  {
    value: IFilterType.COMPLETED,
    label: 'Complete',
    icon: <CheckCircle className="h-4 w-4" />,
    activeColor: 'bg-emerald-500 text-white font-bold hover:bg-emerald-600',
  },
];

export { filtersOptions };

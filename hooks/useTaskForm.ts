'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { IFormValues } from '@/types';
import { useTasks } from '@/context/tasks/TaskContext';

const formSchema = z.object({
  todo: z.string().min(2, {
    message: 'ITask must be at least 2 characters.',
  }),
});

export function useTaskForm() {
  const { addTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<IFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo: '',
    },
  });

  async function onSubmit(values: IFormValues) {
    setIsSubmitting(true);
    try {
      addTask(values.todo);
      form.reset();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, isSubmitting, open, setOpen, onSubmit };
}

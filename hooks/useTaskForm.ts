'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTasks } from '@/context/tasks';
import { FormValues } from '@/types';

const formSchema = z.object({
  todo: z.string().min(2, {
    message: 'Task must be at least 2 characters.',
  }),
});

export function useTaskForm() {
  const { addTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo: '',
    },
  });

  async function onSubmit(values: FormValues) {
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

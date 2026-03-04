'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTasks } from '@hooks/useTasks';
import { Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const formSchema = z.object({
  todo: z.string().min(2, {
    message: 'Task must be at least 2 characters.',
  }),
});

export function TaskForm() {
  const { addTask } = useTasks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await addTask(values.todo);
      form.reset();
      setOpen(false); // Close modal on success
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl shadow-primary/50 z-50 transition-transform hover:scale-105"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle>Add New Star</DialogTitle>
          <DialogDescription>
            Create a new task. It will instantly appear as a star in your galaxy.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="todo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="What needs to be done?"
                      {...field}
                      disabled={isSubmitting}
                      className="bg-background/50 border-border/50 text-lg"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Ignite Star'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

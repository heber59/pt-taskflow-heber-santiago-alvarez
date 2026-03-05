'use client';

import { Task, TaskModalProps } from '@/types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useTaskModal } from '@/hooks/useTaskModal';
import { useTasks } from '@/context/tasks/TaskContext';

export function TaskModal({ task, open, onOpenChange }: TaskModalProps) {
  const { toggleTask, deleteTask } = useTasks();

  const { handleToggle, handleDelete, confirmOpen, setConfirmOpen } = useTaskModal(
    task!,
    toggleTask,
    deleteTask,
    onOpenChange
  );

  if (!task) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] bg-slate-900/90 backdrop-blur-2xl border-white/10 text-white shadow-2xl">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <Badge
                variant={task.completed ? 'default' : 'secondary'}
                className={
                  task.completed
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                }
              >
                {task.completed ? 'Burning Star (Complete)' : 'Dormant Star (Pending)'}
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight mt-4">
              {task.todo}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Current coordinates: Sector {task.id % 100}, Star {task.id % 999}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <Button
              variant="outline"
              className={`w-full h-14 justify-start gap-4 text-lg border-white/10 hover:bg-white/5 transition-all ${task.completed ? 'text-blue-400 hover:text-blue-300' : 'text-emerald-400 hover:text-emerald-300'}`}
              onClick={handleToggle}
            >
              {task.completed ? (
                <>
                  <Circle className="h-6 w-6" />
                  Dim Star (Mark Pending)
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-6 w-6" />
                  Ignite Star (Mark Complete)
                </>
              )}
            </Button>
          </div>

          <DialogFooter className="sm:justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-white/5"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all gap-2"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Supernova (Delete)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Supernova esta estrella?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              "{task.todo}" será eliminada permanentemente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

'use client';

import { Task, TaskModalProps } from '@/types';
import { useTasks } from '@/context/tasks';
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
import { Trash2, CheckCircle2, Circle, X } from 'lucide-react';

export function TaskModal({ task, open, onOpenChange }: TaskModalProps) {
    const { toggleTask, deleteTask } = useTasks();

    if (!task) return null;

    const handleToggle = () => {
        toggleTask(task.id);
    };

    const handleDelete = async () => {
        await deleteTask(task.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-slate-900/90 backdrop-blur-2xl border-white/10 text-white shadow-2xl">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <Badge
                            variant={task.completed ? "default" : "secondary"}
                            className={task.completed ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-blue-500/20 text-blue-400 border-blue-500/50"}
                        >
                            {task.completed ? 'Ignited' : 'Fading'}
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
                                Dampen Star (Mark Pending)
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
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                        Supernova (Delete)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

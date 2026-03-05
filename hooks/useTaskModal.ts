import { IUseTaskModal } from '@/types';
import { useState } from 'react';

const useTaskModal = (props: IUseTaskModal) => {
  const { task, toggleTask, deleteTask, onOpenChange } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleToggle = () => {
    if (!task) return;
    toggleTask(task.id);
  };

  const handleDelete = async () => {
    if (!task) return;
    await deleteTask(task.id);
    onOpenChange(false);
  };

  return { handleToggle, handleDelete, confirmOpen, setConfirmOpen };
};
export { useTaskModal };

import { IUseTaskModal } from '@/types';
import { useState } from 'react';

const useTaskModal = (props: IUseTaskModal) => {
  const { task, toggleTask, deleteTask, onOpenChange } = props;
  const handleToggle = () => toggleTask(task.id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleDelete = async () => {
    await deleteTask(task.id);
    onOpenChange(false);
  };

  return { handleToggle, handleDelete, confirmOpen, setConfirmOpen };
};
export { useTaskModal };

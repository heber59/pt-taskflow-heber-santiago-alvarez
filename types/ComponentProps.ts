import { IFlag } from './Flag';
import { ITask } from './Task';
import React from 'react';

interface IAmbientStarsProps {
  count: number;
}

interface IStarProps {
  task: ITask;
  onClick: (task: ITask) => void;
  scrollRef: React.RefObject<number>;
}

interface ITaskGalaxyProps {
  tasks: ITask[];
  onTaskClick: (task: ITask) => void;
  scrollRef: React.RefObject<number>;
}

interface IScrollManagerProps {
  scrollRef: React.RefObject<number>;
  smoothScrollRef: React.RefObject<number>;
}

interface ITaskModalProps {
  task: ITask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface IErrorComponentProps {
  message: string;
  onRetry: () => void;
}

interface IFlagItem {
  flag: IFlag;
  onRemove: (id: string) => void;
}

export type {
  IAmbientStarsProps,
  IStarProps,
  ITaskGalaxyProps,
  IScrollManagerProps,
  ITaskModalProps,
  IErrorComponentProps,
  IFlagItem,
};

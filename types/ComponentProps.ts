// Component Props Types - For all UI component interfaces

export interface AmbientStarsProps {
  count?: number;
}

export interface StarProps {
  task: import('./Task').Task;
  onClick: (task: import('./Task').Task) => void;
  scrollRef: React.RefObject<number>;
}

export interface TaskGalaxyProps {
  tasks: import('./Task').Task[];
  onTaskClick: (task: import('./Task').Task) => void;
  scrollRef: React.RefObject<number>;
}

export interface ScrollManagerProps {
  scrollRef: React.RefObject<number>;
  smoothScrollRef: React.RefObject<number>;
}

export interface TaskModalProps {
  task: import('./Task').Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
}

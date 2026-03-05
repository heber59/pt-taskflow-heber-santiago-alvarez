'use client';

import { Canvas } from '@react-three/fiber';
import { Task } from '@/types';
import { TaskModal } from '@/components/TaskModal';
import { useStarBackground } from '@/hooks/useStarBackground';
import { AmbientStars, TaskGalaxy, ScrollManager } from '@/components/stars';

export function StarBackground() {
  const {
    visibleTasks,
    selectedTask,
    setSelectedTask,
    isModalOpen,
    setIsModalOpen,
    scrollRef,
    smoothScrollRef,
  } = useStarBackground();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-0 w-full h-full bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 100], far: 1000 }} gl={{ antialias: true }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={1.5} />

        <ScrollManager scrollRef={scrollRef} smoothScrollRef={smoothScrollRef} />
        <AmbientStars count={visibleTasks.length} />
        <TaskGalaxy
          tasks={visibleTasks}
          onTaskClick={handleTaskClick}
          scrollRef={smoothScrollRef}
        />
      </Canvas>

      <TaskModal task={selectedTask} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}

'use client';

import { TaskForm } from '@components/TaskForm';
import { FilterBar } from '@components/FilterBar';
import { StarBackground } from '@components/StarBackground';

import { Loader2 } from 'lucide-react';
import { useFlag } from '@/components/FlagProvider';
import { useEffect } from 'react';
import { TaskProvider, useTasks } from '@/context/tasks/TaskContext';

function PageContent() {
  const { error, loading, isInitialized } = useTasks();
  const { addFlag } = useFlag();

  useEffect(() => {
    if (error) {
      addFlag(error, 'error');
    }
  }, [error]);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="relative h-screen w-screen overflow-hidden text-slate-50 selection:bg-white/20">
      {/* 3D Background Data Visualization - Fixed at Z-Index 0 */}
      <StarBackground />

      {/* Main UI Overlay - Positioned Absolutely to allow stars to show through */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        {/* Header Section */}
        <header className="w-full p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pointer-events-auto bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-2xl">
              TASKGALAXY
            </h1>
            <p className="text-slate-300 text-sm font-medium tracking-wide drop-shadow-md opacity-80 uppercase">
              Universal System Orchestrator
            </p>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-xl rounded-full border border-white/10 p-1 shadow-2xl flex items-center">
            <FilterBar />
          </div>
        </header>

        {/* Dynamic Content Area (Errors) */}
        <main className="flex-1" />

        {/* Footer / Status Area */}
        <footer className="p-8 flex justify-between items-end">
          <div className="pointer-events-auto">
            {loading && (
              <div className="flex items-center gap-3 text-white/90 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-2xl border border-white/20 shadow-xl transition-all animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs font-bold tracking-widest uppercase">
                  Syncing Dyson Sphere...
                </span>
              </div>
            )}
          </div>

          {/* Task Entry Point (Floating Modal Trigger) */}
          <div className="pointer-events-auto">
            <TaskForm />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <TaskProvider>
      <PageContent />
    </TaskProvider>
  );
}

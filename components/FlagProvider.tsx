'use client';

import { colors } from '@/config/flag/colors';
import { dots } from '@/config/flag/dots';
import { FlagContext } from '@/context/flag';
import { Flag, useFlagProvider } from '@/hooks/useFlagProvider';
import { useContext } from 'react';

function FlagItem({ flag, onRemove }: { flag: Flag; onRemove: (id: string) => void }) {
  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl
        border backdrop-blur-xl shadow-2xl max-w-sm
        animate-in slide-in-from-right-4 fade-in duration-300
            ${colors[flag.type]}
        `}
    >
      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 animate-pulse ${dots[flag.type]}`} />
      <p className="text-sm font-medium leading-snug flex-1">{flag.message}</p>
      <button
        onClick={() => onRemove(flag.id)}
        className="opacity-50 hover:opacity-100 transition-opacity text-xs mt-0.5 shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

function FlagProvider({ children }: { children: React.ReactNode }) {
  const { flags, addFlag, removeFlag } = useFlagProvider();

  return (
    <FlagContext.Provider value={{ addFlag }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {flags.map((flag) => (
          <FlagItem key={flag.id} flag={flag} onRemove={removeFlag} />
        ))}
      </div>
    </FlagContext.Provider>
  );
}

function useFlag() {
  const ctx = useContext(FlagContext);
  if (!ctx) throw new Error('useFlag must be used within FlagProvider');
  return ctx;
}

export { FlagProvider, useFlag };

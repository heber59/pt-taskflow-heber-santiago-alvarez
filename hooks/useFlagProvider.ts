import { IFlag } from '@/types';

import { useState, useCallback, useRef } from 'react';

const useFlagProvider = () => {
  const [flags, setFlags] = useState<IFlag[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeFlag = useCallback((id: string) => {
    setFlags((prev) => prev.filter((f) => f.id !== id));
    timers.current.delete(id);
  }, []);

  const addFlag = useCallback(
    (message: string, type: IFlag['type'] = 'error') => {
      const id = crypto.randomUUID();
      setFlags((prev) => [...prev, { id, message, type }]);

      const timer = setTimeout(() => removeFlag(id), 4000);
      timers.current.set(id, timer);
    },
    [removeFlag]
  );

  return { flags, addFlag, removeFlag };
};

export { useFlagProvider };

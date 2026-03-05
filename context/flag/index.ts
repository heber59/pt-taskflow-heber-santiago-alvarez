import { IFlagContextValue } from '@/types';
import { createContext } from 'react';

const FlagContext = createContext<IFlagContextValue | null>(null);
export { FlagContext };

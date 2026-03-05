import { Flag } from '@/types';

interface IFlagContextValue {
  addFlag: (message: string, type?: Flag['type']) => void;
}
export type { IFlagContextValue };

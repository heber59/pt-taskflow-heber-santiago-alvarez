import { IFlag } from '@/types';

interface IFlagContextValue {
  addFlag: (message: string, type?: IFlag['type']) => void;
}
export type { IFlagContextValue };

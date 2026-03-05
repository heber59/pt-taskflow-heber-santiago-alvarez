import { Flag } from '@/types';
interface IUseTaskApi {
  addFlag: (message: string, type?: Flag['type']) => void;
}
export type { IUseTaskApi };

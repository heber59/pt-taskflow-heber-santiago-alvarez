import { IFlag } from '@/types';
interface IUseTaskApi {
  addFlag: (message: string, type?: IFlag['type']) => void;
}
export type { IUseTaskApi };

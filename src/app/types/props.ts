import { IDcitionary } from '@/app/types/types';

export interface INameDictMap {
  [key: string]: IDcitionary<number | string | boolean | undefined>
}

import { PaginationParams } from '@/types';
export interface UserPaginationParams extends PaginationParams {
  username?: string;
  email?: string;
  phone?: string;
}
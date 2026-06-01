import { SetMetadata } from '@nestjs/common';

// 开放的接口打上“公开”的标记
export const IS_PUBLIC_KEY = 'isPublic';
export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}
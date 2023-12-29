import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type { DBComponent } from '@/server/utils/db'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

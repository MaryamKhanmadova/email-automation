import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pause = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

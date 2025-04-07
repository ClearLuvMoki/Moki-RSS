import { type ClassValue, clsx } from "clsx";
import { app } from "electron";
import { twMerge } from "tailwind-merge";

export const isDev = !app.isPackaged;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

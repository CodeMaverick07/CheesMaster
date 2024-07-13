import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

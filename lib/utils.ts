import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const getStatusColor = (status) => {
    switch (status) {
      case "up":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "MAINTENANCE":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "down":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };
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
export const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "info":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };


export function dateConversion(isoDate:any):string
{
  const date = new Date(isoDate);

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0"); 
  const ano = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
 
}


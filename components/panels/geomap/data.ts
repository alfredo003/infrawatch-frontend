import useSWR from "swr"; 
import { IMapMachine, listAllSystems, listAllSystemsInMap, SystemData } from "@/services/systemService";

export interface IMapMachineStatus {
  up: string;
  down: string;
  maintenance: string;
}

export const machineStatus: IMapMachineStatus = {
  up: "bg-green-600/10 text-green-500",
  down: "bg-red-600/10 text-red-500",
  maintenance: "bg-yellow-600/10 text-yellow-500",
};

export function useSystems() {
  return useSWR<IMapMachine[]>("systems", listAllSystemsInMap, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  })
}

  
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PackageCheck,
  AlertTriangle,
  Plus,
  Settings,
  MapPinned,
} from "lucide-react";

const Map = dynamic(() => import("./partials/Map"), { ssr: false });

export interface IMapMachine {
  id: number;
  name: string;
  status: {
    id: "active" | "inactive" | "maintenance";
    label: string;
  };
  type: string;
  connection_type: string;
  lat: number;
  lng: number;
  lastCheck: string;

  check_interval: string;
  owner_user_id: string;
  company_id: string;
  target: string;
  sla_target: number;
  criticality_level: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export interface IMapMachineStatus {
  active: string;
  inactive: string;
  maintenance: string;
}

const machineStatus: IMapMachineStatus = {
  active: "bg-green-600/10 text-green-500",
  inactive: "bg-red-600/10 text-red-500",
  maintenance: "bg-yellow-600/10 text-yellow-500",
};

export default function GeoMap() {
  const [open, setOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<IMapMachine>();

  function openSheet(machine: IMapMachine) {
    setOpen(true);
    setSelectedMachine(machine);
  }

  return (
    <main className="relative z-0 h-screen w-full bg-white dark:bg-black text-black dark:text-white flex flex-col gap-4 p-6">
      <section className="">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              Localizações geográficas
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Localize as máquinas no mapa
            </p>
          </div>
          <Button
            // onClick={() => alert()}
            className="bg-blue-600 text-white hover:bg-blue-600/70 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Total mapeadas
                  </p>
                  <p className="text-2xl font-bold text-blue-600">7</p>
                </div>
                <MapPinned className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Em manutenção
                  </p>
                  <p className="text-2xl font-bold text-orange-600">5</p>
                </div>
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Operacionais
                  </p>
                  <p className="text-2xl font-bold text-green-600">4</p>
                </div>
                <PackageCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Com Problemas
                  </p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full flex-1 rounded-md">
        <Map onSelectMachine={openSheet} />
      </section>
      {selectedMachine && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-[420px] overflow-auto p-6">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-semibold">
                  {selectedMachine.name}
                </SheetTitle>

                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    machineStatus[selectedMachine.status.id]
                  )}
                >
                  {selectedMachine.status.label}
                </span>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-8">
              {/* Identification */}
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Identificação
                </h3>
                <div className="mt-3 rounded-lg border p-4 text-sm">
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="font-medium">ID:</span>
                    <span>{selectedMachine.id}</span>
                    <span className="font-medium">Tipo:</span>
                    <span>{selectedMachine.type}</span>
                    <span className="font-medium">Conexão:</span>
                    <span>{selectedMachine.connection_type}</span>
                    <span className="font-medium">Target:</span>
                    <span className="truncate">{selectedMachine.target}</span>
                  </div>
                </div>
              </div>

              {/* Monitoring */}
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Monitoramento
                </h3>
                <div className="mt-3 rounded-lg border p-4 text-sm">
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="font-medium">Intervalo:</span>
                    <span>{selectedMachine.check_interval}</span>
                    <span className="font-medium">SLA Target:</span>
                    <span>{selectedMachine.sla_target ?? "—"}%</span>
                    <span className="font-medium">Criticidade:</span>
                    <span className="capitalize">
                      {selectedMachine.criticality_level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Metadados
                </h3>
                <div className="mt-3 rounded-lg border p-4 text-sm">
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="font-medium">Responsável:</span>
                    <span>{selectedMachine.owner_user_id}</span>
                    <span className="font-medium">Empresa:</span>
                    <span>{selectedMachine.company_id}</span>
                    <span className="font-medium">Criado em:</span>
                    <span>
                      {new Date(selectedMachine.created_at).toLocaleString(
                        "pt-PT"
                      )}
                    </span>
                    <span className="font-medium">Última atualização:</span>
                    <span>
                      {new Date(selectedMachine.updated_at).toLocaleString(
                        "pt-PT"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </main>
  );
}

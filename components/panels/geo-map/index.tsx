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
import { Badge } from "@/components/ui/badge";

const Map = dynamic(() => import("./partials/Map"), { ssr: false });

export interface Machine {
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

export interface MachineState {
  active: string;
  inactive: string;
  maintenance: string;
}

const machineTypes: MachineState = {
  active: "bg-green-600/10 text-green-500",
  inactive: "bg-red-600/10 text-red-500",
  maintenance: "bg-yellow-600/10 text-yellow-500",
};

export default function GeoMap() {
  const [open, setOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine>();

  function openSheet(machine: Machine) {
    setOpen(true);
    setSelectedMachine(machine);
  }

  return (
    <main className="relative z-0 h-screen w-screen">
      <Map onSelectMachine={openSheet} />
      {selectedMachine && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-[420px] overflow-auto p-6">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-semibold">
                  {selectedMachine.name}
                </SheetTitle>
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    machineTypes[selectedMachine.status.id]
                  )}
                >
                  {selectedMachine.status.label}
                </Badge>
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

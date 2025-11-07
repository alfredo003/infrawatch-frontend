'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './partials/ui/sheet';
import {
  PackageCheck,
  AlertTriangle,
  Settings,
  TriangleAlert,
  X,
} from 'lucide-react';
import { IMapMachine } from '@/services/systemService';

const Map = dynamic(() => import('./partials/Map'), { ssr: false });

export interface IMapMachineStatus {
  up: string;
  down: string;
  maintenance: string;
}

const machineStatus: IMapMachineStatus = {
  up: 'bg-green-600/10 text-green-500',
  down: 'bg-red-600/10 text-red-500',
  maintenance: 'bg-yellow-600/10 text-yellow-500',
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
      <section className="w-full flex-1 rounded-md relative">
        <Map onSelectMachine={openSheet} />

        {/* Legenda */}
        <div
          className="fixed bottom-4 left-4 z-50 bg-white dark:bg-neutral-900 
                  border border-neutral-200 dark:border-neutral-700 
                  rounded-lg shadow-lg p-3 w-60"
        >
          <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Legenda do Mapa
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <PackageCheck
                className="w-4 h-4 text-green-600"
                aria-label="Operacionais"
              />
              <span className="text-neutral-600 dark:text-neutral-400">
                Operacionais
              </span>
            </li>
            <li className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-600" aria-label="Com problemas" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Com problemas
              </span>
            </li>
            <li className="flex items-center gap-2">
              <TriangleAlert
                className="w-4 h-4 text-orange-600"
                aria-label="Em manutenção"
              />
              <span className="text-neutral-600 dark:text-neutral-400">
                Em manutenção
              </span>
            </li>
          </ul>
        </div>
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
                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                    machineStatus[selectedMachine.status],
                  )}
                >
                  {selectedMachine.status}
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
                    <span>{selectedMachine.sla_target ?? '—'}%</span>
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
                        'pt-PT',
                      )}
                    </span>
                    <span className="font-medium">Última atualização:</span>
                    <span>
                      {new Date(selectedMachine.updated_at).toLocaleString(
                        'pt-PT',
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

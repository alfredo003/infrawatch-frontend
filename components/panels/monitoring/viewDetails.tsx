"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStatusColor, dateConversion } from "@/lib/utils";
import { connectionTypes } from "./data";
import { SystemData } from "@/services/systemService";

interface ModalProps {
  selectedServer: SystemData;
  setSelectedServer: (server: SystemData | null) => void;
}

export default function ModalViewSystem({ selectedServer, setSelectedServer }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-start z-50 min-h-screen">
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-2xl w-full h-full flex flex-col">
        
        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white dark:bg-neutral-900 z-10 p-4 sm:p-6">
          <div>
            <CardTitle className="text-lg sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
              {selectedServer.name}
            </CardTitle>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              {selectedServer.id} • {selectedServer.connection_type}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setSelectedServer(null)}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-lg sm:text-xl"
          >
            ✕
          </Button>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="p-4 sm:p-6 flex-grow flex flex-col space-y-6 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 flex-grow">
            
            {/* INFO PRINCIPAL */}
            <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                
                {/* STATUS */}
                <div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-medium">STATUS</p>
                  <Badge className={`${getStatusColor(selectedServer.status)} font-medium text-xs sm:text-sm`}>
                    {selectedServer.status === "up"
                      ? "Online"
                      : selectedServer.status === "down"
                      ? "Offline"
                      : "Em manutenção"}
                  </Badge>
                </div>

                {/* LOCALIZAÇÃO */}
                <div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-medium">ALVO</p>
                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">{selectedServer.target}</p>
                </div>

                {/* UPTIME */}
                <div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-medium">UPTIME</p>
                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-mono">
                    {selectedServer.metric.uptime_percent}%
                  </p>
                </div>

                {/* ÚLTIMA VERIFICAÇÃO */}
                <div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-medium">ÚLTIMA VERIFICAÇÃO</p>
                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                    {dateConversion(selectedServer.metric.last_check)}
                  </p>
                </div>
              </div>

              {/* MÉTRICAS */}
              <div className="flex-1 flex flex-col">
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">MÉTRICAS DISPONÍVEIS</p>
                <div className="flex-1 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">Tipo</TableHead>
                        <TableHead className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">Métrica</TableHead>
                        <TableHead className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {connectionTypes
                        .filter((conn) => conn.type === selectedServer.connection_type) // ajustado
                        .flatMap((conn) =>
                          conn.metrics.map((metric) => (
                            <TableRow key={`${conn.type}-${metric.key}`}>
                              <TableCell className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm">
                                {conn.label}
                              </TableCell>
                              <TableCell className="flex items-center gap-2 text-xs sm:text-sm">
                                <metric.icon className="w-4 h-4" />  
                                <span className="text-neutral-800 dark:text-neutral-200">{metric.label}</span>
                              </TableCell>
                              <TableCell className="text-neutral-800 dark:text-neutral-200 font-mono text-xs sm:text-sm">
                                {selectedServer.metric[metric.key] || 0} {metric.unit}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* DIAGRAMA */}
            <div className="flex-1 flex flex-col">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-2 font-medium">DIAGRAMA DE PORTAS</p>
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 sm:p-4 flex-1 flex flex-col justify-center">
               
                {selectedServer.connection_type === "ping" ? (
                  <img
                    src="/computador_dell_xps.webp"
                    alt="Diagrama de portas da máquina"
                    className="w-full h-auto max-h-[400px] object-contain rounded-md shadow-sm"
                  />
                ) : (
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 sm:p-4 flex-1 flex flex-col justify-center">
                  <img
                    src="https://via.placeholder.com/600x400?text=Diagrama+de+Portas+da+Máquina"
                    alt="Diagrama de portas da máquina"
                    className="w-full h-auto max-h-[200px] object-contain rounded-md shadow-sm"
                  />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                  Diagrama esquemático das portas da máquina monitorada
                </p>
              </div>
                )}
                  
              </div>
            </div>
          </div>

          {/* AÇÕES */}
          <div className="flex gap-2 pt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-3 sm:px-4 py-2">
              Ver Logs
            </Button>
            <Button
              variant="outline"
              className="border-neutral-300 dark:border-neutral-600 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              Reiniciar
            </Button>
            <Button
              variant="outline"
              className="border-neutral-300 dark:border-neutral-600 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

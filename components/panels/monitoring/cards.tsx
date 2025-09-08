import { Progress } from "@/components/ui/progress";
import { connectionTypes } from "./data";
import { Activity, AlertCircle, Clock, Cpu, HardDrive, Webhook } from "lucide-react";
import { CardContent } from "@/components/ui/card";

export function PingCard({ server }: { server: any }) {
  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
              <div >
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                   Latência
                  </span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 font-mono">
                  {server.metric?.value.latency? server.metric?.value.latency : 4 } ms
                </div>
              </div>
               <div >
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                   Perda de Pacotes
                  </span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 font-mono">
                  {server.metric?.value.packetLoss} %
                </div>
              </div>
      </div>
    </CardContent>
  );
}

export function SnmpCard({ server }: { server: any }) {
  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        
              <div >
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    CPU
                  </span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 font-mono">
                {server.metric?.value.cpu?server.metric.value.cpu:0} %
                </div>
                  <Progress
                    value={server.metric?.value.cpu?server.metric.value.cpu:0}
                    className="h-1.5 mt-1 bg-neutral-200 dark:bg-neutral-700"
                  /> 
              </div>

              <div >
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Memória
                  </span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 font-mono">
                 {server.metric?.value.cpu?server.metric.value.ram:0} %
                </div>
                  <Progress
                    value={server.metric?.value.cpu?server.metric.value.ram:0}
                    className="h-1.5 mt-1 bg-neutral-200 dark:bg-neutral-700"
                  /> 
              </div>

              <div >
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Disco
                  </span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 font-mono">
                {server.metric?.value.cpu?server.metric.value.disco:0} %
                </div>
                  <Progress
                    value={server.metric?.value.cpu?server.metric.value.disco:0}
                    className="h-1.5 mt-1 bg-neutral-200 dark:bg-neutral-700"
                  /> 
              </div>
           
      </div>
    </CardContent>
  );
}

export function ApiCard({ server }: { server: any }) {
  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
         
              <div  >
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Tempo de Resposta
                  </span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 font-mono">
                  {server.metric?.value.response_time} ms
                </div>
              </div>
              <div  >
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Usuários Ativos
                  </span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 font-mono">
                  0
                </div>
              </div>
      </div>
    </CardContent>
  );
}

export function WebhookCard({ server }: { server: any }) {
 
  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
 
              <div key={server.id}>
                <div className="flex items-center gap-2 mb-1">
                  <Webhook className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Eventos Recebidos
                  </span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 font-mono">
                 webhookEvents  
                </div>
              </div>
 
      </div>
    </CardContent>
  );
}

export function renderCardContent(server: any) {
  switch (server.connection_type) {
    case "ping":
      return <PingCard server={server} />;
    case "snmp":
      return <SnmpCard server={server} />;
    case "api":
      return <ApiCard server={server} />;
    case "webhook":
      return <WebhookCard server={server} />;
    default:
      return (
        <CardContent>
          <p className="text-neutral-600 dark:text-neutral-400">
            Tipo de conexão não suportado
          </p>
        </CardContent>
      );
  }
}
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Server, Activity, Settings, Locate } from "lucide-react";
import ModalViewSystem from "./viewDetails";
import { dateConversion, getStatusColor } from "@/lib/utils";
import { connectionTypes } from "./data";
import {
  DataMetrics,
  listAllSystems,
  SystemData,
} from "@/services/systemService";
import { renderCardContent } from "./cards";

export default function MonitoringPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServer, setSelectedServer] = useState<SystemData | null>(null);
  const [selectedConnectionType, setSelectedConnectionType] = useState("ping");

  const [systems, setSystems] = useState<any[]>([]);

  useEffect(() => {
    const URL = process.env.NEXT_PUBLIC_API_URL;
    const eventSource = new EventSource(`${URL}/stream/systems`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSystems(data);
    };

    eventSource.onerror = (err) => {
      console.log("Erro SSE:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const allSystems: SystemData[] = systems || [];

  const filteredSystems = allSystems.filter(
    (sys) =>
      sys.connection_type.toLowerCase() ===
        selectedConnectionType.toLowerCase() &&
      (sys.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sys.typeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sys.connection_type.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const onlineCount = allSystems.filter((s) => s.status === "up").length;
  const maintenanceCount = allSystems.filter(
    (s) => s.status === "MAINTENANCE",
  ).length;
  const offlineCount = allSystems.filter((s) => s.status === "down").length;

  return (
    <div className="p-6 space-y-6 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
            Monitoramento de Equipamentos Corporativos
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Gerenciamento e monitoramento em tempo real de equipamentos de TI
          </p>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Buscar Sistema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 tracking-wider font-medium">
                  EQUIPAMENTOS ONLINE
                </p>
                <p className="text-2xl font-bold text-green-600 font-mono">
                  {onlineCount}
                </p>
              </div>
              <Server className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 tracking-wider font-medium">
                  COM ALERTAS
                </p>
                <p className="text-2xl font-bold text-yellow-600 font-mono">
                  {maintenanceCount}
                </p>
              </div>
              <Activity className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 tracking-wider font-medium">
                  OFFLINE
                </p>
                <p className="text-2xl font-bold text-red-600 font-mono">
                  {offlineCount}
                </p>
              </div>
              <Server className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Types Tabs */}
      <div className="space-y-4">
        <Tabs
          defaultValue="ping"
          onValueChange={setSelectedConnectionType}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            {connectionTypes.map((conn) => (
              <TabsTrigger
                key={conn.type}
                value={conn.type}
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:bg-neutral-900 dark:data-[state=active]:text-blue-400"
              >
                <conn.icon className="w-4 h-4" />
                {conn.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSystems.length > 0 ? (
          filteredSystems.map((server: any) => (
            <Card
              key={server.id}
              className={`bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 shadow-sm hover:border-blue-500/30 transition-colors cursor-pointer 
    ${server.status === "down" ? "animate-glow  border-red-500" : ""}`}
              onClick={() => setSelectedServer(server)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                    <div>
                      <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-200 font-sans">
                        {server.name}
                      </CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {server.type}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${getStatusColor(server.status)} font-medium`}
                  >
                    {server.status === "up"
                      ? "UP"
                      : server.status === "down"
                        ? "DOWN"
                        : "DOWN"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderCardContent(server)}

                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Uptime:{" "}
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-mono">
                      {server?.metric?.uptime_percent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Última verificação:{" "}
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200">
                      {dateConversion(server?.metric?.last_check)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <Locate className="w-4 h-4" /> {server.target}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-neutral-600 dark:text-neutral-400">
            Nenhum sistema cadastrado por{" "}
            <span className="font-semibold">
              {selectedConnectionType.toUpperCase()}
            </span>
            .
          </div>
        )}
      </div>

      {/* Server Detail Modal */}
      {selectedServer && (
        <ModalViewSystem
          selectedServer={selectedServer}
          setSelectedServer={setSelectedServer}
        />
      )}
    </div>
  );
}

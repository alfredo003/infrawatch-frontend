"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Server, Cpu, HardDrive, Activity } from "lucide-react"

export default function ServersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedServer, setSelectedServer] = useState(null)

  const servers = [
    {
      id: "SRV-001",
      name: "ERP-PROD",
      status: "online",
      uptime: 99.8,
      cpu: 45,
      memory: 67,
      storage: 34,
      location: "Data Center Principal",
      lastCheck: "30s atrás",
      type: "Servidor de Produção",
    },
    {
      id: "SRV-002",
      name: "WEB-SERVER-01",
      status: "online",
      uptime: 99.9,
      cpu: 23,
      memory: 45,
      storage: 56,
      location: "Data Center Principal",
      lastCheck: "15s atrás",
      type: "Servidor Web",
    },
    {
      id: "SRV-003",
      name: "DB-CLUSTER",
      status: "warning",
      uptime: 98.5,
      cpu: 78,
      memory: 84,
      storage: 67,
      location: "Data Center Secundário",
      lastCheck: "45s atrás",
      type: "Cluster de Base de Dados",
    },
    {
      id: "SRV-004",
      name: "BACKUP-SRV",
      status: "offline",
      uptime: 95.2,
      cpu: 0,
      memory: 0,
      storage: 89,
      location: "Data Center Backup",
      lastCheck: "5m atrás",
      type: "Servidor de Backup",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
      case "offline":
        return "text-red-600 bg-red-100 dark:bg-red-900/20"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
    }
  }

  const filteredServers = servers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Monitoramento de Servidores</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Gestão e monitoramento de servidores corporativos
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Adicionar Servidor</Button>
          <Button variant="outline" className="border-neutral-300 dark:border-neutral-600 bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Buscar servidores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 tracking-wider">SERVIDORES ONLINE</p>
                <p className="text-2xl font-bold text-green-600 font-mono">3</p>
              </div>
              <Server className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 tracking-wider">COM AVISOS</p>
                <p className="text-2xl font-bold text-yellow-600 font-mono">1</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 tracking-wider">OFFLINE</p>
                <p className="text-2xl font-bold text-red-600 font-mono">1</p>
              </div>
              <Server className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServers.map((server) => (
          <Card
            key={server.id}
            className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-blue-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedServer(server)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                  <div>
                    <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                      {server.name}
                    </CardTitle>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{server.type}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(server.status)}>
                  {server.status === "online" ? "Online" : server.status === "warning" ? "Aviso" : "Offline"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu className="w-3 h-3 text-neutral-400" />
                    <span className="text-neutral-600 dark:text-neutral-400">CPU</span>
                  </div>
                  <div className="text-neutral-800 dark:text-neutral-200 font-mono">{server.cpu}%</div>
                  <Progress value={server.cpu} className="h-1 mt-1" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-3 h-3 text-neutral-400" />
                    <span className="text-neutral-600 dark:text-neutral-400">Memória</span>
                  </div>
                  <div className="text-neutral-800 dark:text-neutral-200 font-mono">{server.memory}%</div>
                  <Progress value={server.memory} className="h-1 mt-1" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <HardDrive className="w-3 h-3 text-neutral-400" />
                    <span className="text-neutral-600 dark:text-neutral-400">Disco</span>
                  </div>
                  <div className="text-neutral-800 dark:text-neutral-200 font-mono">{server.storage}%</div>
                  <Progress value={server.storage} className="h-1 mt-1" />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">Uptime: </span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-mono">{server.uptime}%</span>
                </div>
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">Última verificação: </span>
                  <span className="text-neutral-800 dark:text-neutral-200">{server.lastCheck}</span>
                </div>
              </div>

              <div className="text-sm text-neutral-600 dark:text-neutral-400">📍 {server.location}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Server Detail Modal */}
      {selectedServer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                  {selectedServer.name}
                </CardTitle>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedServer.id} • {selectedServer.type}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedServer(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">STATUS</p>
                  <Badge className={getStatusColor(selectedServer.status)}>
                    {selectedServer.status === "online"
                      ? "Online"
                      : selectedServer.status === "warning"
                        ? "Aviso"
                        : "Offline"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">LOCALIZAÇÃO</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">{selectedServer.location}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">UPTIME</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200 font-mono">{selectedServer.uptime}%</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">ÚLTIMA VERIFICAÇÃO</p>
                  <p className="text-sm text-neutral-800 dark:text-neutral-200">{selectedServer.lastCheck}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Ver Logs</Button>
                <Button variant="outline" className="border-neutral-300 dark:border-neutral-600 bg-transparent">
                  Reiniciar
                </Button>
                <Button variant="outline" className="border-neutral-300 dark:border-neutral-600 bg-transparent">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

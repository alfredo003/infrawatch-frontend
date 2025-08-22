"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Wifi } from "lucide-react"

export default function DashboardPage() {
  const systemsOverview = [
    { name: "ERP-PROD", status: "online", uptime: 99.8, lastCheck: "30s", type: "Servidor" },
    { name: "WEB-SERVER-01", status: "online", uptime: 99.9, lastCheck: "15s", type: "Servidor Web" },
    { name: "DB-CLUSTER", status: "warning", uptime: 98.5, lastCheck: "45s", type: "Base de Dados" },
    { name: "BACKUP-SRV", status: "offline", uptime: 95.2, lastCheck: "5m", type: "Backup" },
    { name: "KIOSKS-API", status: "online", uptime: 99.3, lastCheck: "20s", type: "API" },
  ]

  const recentAlerts = [
    { id: 1, system: "DB-CLUSTER", message: "Alto uso de CPU detectado", severity: "warning", time: "2 min atrás" },
    { id: 2, system: "BACKUP-SRV", message: "Servidor não responde", severity: "critical", time: "5 min atrás" },
    { id: 3, system: "NETWORK-SW-01", message: "Latência elevada", severity: "warning", time: "8 min atrás" },
  ]

  const getStatusColor = (status: string) => {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/20"
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
      case "info":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* KPIs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">SISTEMAS ONLINE</p>
                <p className="text-3xl font-bold text-green-600">243</p>
                <p className="text-xs text-neutral-500">de 247 total</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">ALERTAS ATIVOS</p>
                <p className="text-3xl font-bold text-red-600">4</p>
                <p className="text-xs text-neutral-500">2 críticos</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">UPTIME MÉDIO</p>
                <p className="text-3xl font-bold text-blue-600">99.2%</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">+0.3% vs mês anterior</p>
                </div>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">TEMPO RESPOSTA</p>
                <p className="text-3xl font-bold text-blue-600">245ms</p>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">-15ms vs ontem</p>
                </div>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Systems Status */}
        <Card className="lg:col-span-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Estado dos Sistemas Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemsOverview.map((system, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    <div>
                      <h3 className="font-medium text-neutral-800 dark:text-neutral-200">{system.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{system.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{system.uptime}%</p>
                      <p className="text-xs text-neutral-500">Uptime</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{system.lastCheck}</p>
                      <p className="text-xs text-neutral-500">Última verificação</p>
                    </div>
                    <Badge className={getStatusColor(system.status)}>
                      {system.status === "online" ? "Online" : system.status === "warning" ? "Aviso" : "Offline"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="border-l-4 border-l-red-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-800 dark:text-neutral-200">{alert.system}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{alert.message}</p>
                      <p className="text-xs text-neutral-500 mt-1">{alert.time}</p>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity === "critical" ? "Crítico" : alert.severity === "warning" ? "Aviso" : "Info"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Desempenho da Infraestrutura (Últimas 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            {/* Chart Grid */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-10">
              {Array.from({ length: 72 }).map((_, i) => (
                <div key={i} className="border border-neutral-300 dark:border-neutral-600"></div>
              ))}
            </div>

            {/* Chart Lines */}
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                points="0,200 50,180 100,190 150,170 200,175 250,160 300,180 350,150 400,160 450,140"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <polyline
                points="0,220 50,210 100,215 150,200 200,205 250,195 300,210 350,185 400,190 450,175"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>

            {/* Legend */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">CPU Médio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-green-600 rounded"></div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">Memória Média</span>
              </div>
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-8">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-neutral-500 -mb-6">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLA Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">SLA Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">ERP-PROD</span>
                  <span className="text-sm font-medium text-green-600">99.8%</span>
                </div>
                <Progress value={99.8} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">KIOSKS-API</span>
                  <span className="text-sm font-medium text-green-600">99.3%</span>
                </div>
                <Progress value={99.3} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">WEB-SERVER</span>
                  <span className="text-sm font-medium text-green-600">99.9%</span>
                </div>
                <Progress value={99.9} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Incidentes por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Hardware</span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Rede</span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Software</span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Base de Dados</span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Conectividade de Rede
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Internet Principal</span>
                </div>
                <Badge className="text-green-600 bg-green-100 dark:bg-green-900/20">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Backup ISP</span>
                </div>
                <Badge className="text-green-600 bg-green-100 dark:bg-green-900/20">Standby</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">VPN Corporativa</span>
                </div>
                <Badge className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20">Lenta</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

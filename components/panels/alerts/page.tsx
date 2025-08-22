"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, Bell, X } from "lucide-react";

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      title: "Servidor BACKUP-SRV não responde",
      description:
        "O servidor de backup não está respondendo aos pings há 5 minutos",
      severity: "critical",
      system: "BACKUP-SRV",
      timestamp: "2025-01-08 14:32:15",
      status: "active",
    },
    {
      id: 2,
      title: "Alto uso de CPU no DB-CLUSTER",
      description: "CPU acima de 85% por mais de 10 minutos consecutivos",
      severity: "warning",
      system: "DB-CLUSTER",
      timestamp: "2025-01-08 14:28:42",
      status: "active",
    },
    {
      id: 3,
      title: "Latência elevada na rede",
      description: "Latência média acima de 100ms detectada no NETWORK-SW-01",
      severity: "warning",
      system: "NETWORK-SW-01",
      timestamp: "2025-01-08 14:25:18",
      status: "active",
    },
    {
      id: 4,
      title: "Falha de conectividade resolvida",
      description: "Conectividade com WEB-SERVER-01 foi restaurada",
      severity: "info",
      system: "WEB-SERVER-01",
      timestamp: "2025-01-08 13:45:22",
      status: "resolved",
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "info":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const activeAlerts = alerts.filter((alert) => alert.status === "active");
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Centro de Alertas
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Monitoramento de alertas e notificações do sistema
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Bell className="w-4 h-4 mr-2" />
          Configurar Alertas
        </Button>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  ALERTAS ATIVOS
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {activeAlerts.length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  CRÍTICOS
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {activeAlerts.filter((a) => a.severity === "critical").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  AVISOS
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {activeAlerts.filter((a) => a.severity === "warning").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  RESOLVIDOS HOJE
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {resolvedAlerts.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Alertas Ativos ({activeAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                        <span>Sistema: {alert.system}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity === "critical"
                        ? "Crítico"
                        : alert.severity === "warning"
                          ? "Aviso"
                          : "Info"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Resolved Alerts */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Alertas Resolvidos Recentemente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg opacity-75"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {alert.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                      <span>Sistema: {alert.system}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                  <Badge className="text-green-600 bg-green-100 dark:bg-green-900/20">
                    Resolvido
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Clock, Bell, X, Info } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Servidor BACKUP-SRV não responde",
      description: "O servidor de backup não está respondendo aos pings há 5 minutos",
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
      title: "Falha de conectividade resolvida",
      description: "Conectividade com WEB-SERVER-01 foi restaurada",
      severity: "info",
      system: "WEB-SERVER-01",
      timestamp: "2025-01-08 13:45:22",
      status: "resolved",
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 101,
      title: "Integração concluída com sucesso",
      description: "Integração com o sistema de pagamentos finalizada sem erros.",
      type: "success",
      timestamp: "2025-01-08 14:35:00",
    },
    {
      id: 102,
      title: "Usuário logado",
      description: "O administrador acessou o painel.",
      type: "info",
      timestamp: "2025-01-08 14:20:00",
    },
    {
      id: 103,
      title: "Atualização disponível",
      description: "Nova versão do sistema está pronta para instalação.",
      type: "warning",
      timestamp: "2025-01-08 13:50:00",
    },
  ]);

  const markAsResolved = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a))
    );
  };

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved");

  const renderAlert = (alert) => (
    <div
      key={alert.id}
      className="p-4 rounded-lg border-l-4 bg-neutral-50 dark:bg-neutral-900 mb-3"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{alert.title}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {alert.description}
          </p>
          <div className="flex gap-3 mt-2 text-xs text-neutral-500">
            <span>Sistema: {alert.system}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {alert.timestamp}
            </span>
          </div>
        </div>
        {alert.status === "active" && (
          <Button size="sm" variant="ghost" onClick={() => markAsResolved(alert.id)}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderNotification = (n) => {
    const color =
      n.type === "success"
        ? "text-green-600"
        : n.type === "warning"
        ? "text-yellow-600"
        : "text-blue-600";
    const icon =
      n.type === "success" ? (
        <CheckCircle className={`w-5 h-5 ${color}`} />
      ) : n.type === "warning" ? (
        <AlertTriangle className={`w-5 h-5 ${color}`} />
      ) : (
        <Info className={`w-5 h-5 ${color}`} />
      );

    return (
      <div
        key={n.id}
        className="p-4 flex items-start gap-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 mb-3"
      >
        {icon}
        <div>
          <h3 className="font-semibold">{n.title}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {n.description}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
            <Clock className="w-3 h-3" />
            {n.timestamp}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Centro de Notificações</h1>
       
      </div>

      <Tabs defaultValue="alertas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alertas">Alertas ({alerts.length})</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações ({notifications.length})</TabsTrigger>
        </TabsList>

        {/* ALERTAS */}
        <TabsContent value="alertas">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts.length > 0
                ? activeAlerts.map(renderAlert)
                : <p className="text-sm text-neutral-500">Nenhum alerta ativo.</p>}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Alertas Resolvidos</CardTitle>
            </CardHeader>
            <CardContent>
              {resolvedAlerts.length > 0
                ? resolvedAlerts.map(renderAlert)
                : <p className="text-sm text-neutral-500">Nenhum alerta resolvido.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICAÇÕES */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Notificações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.map(renderNotification)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

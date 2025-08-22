"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Monitor, Database, Globe, Smartphone, Clock } from "lucide-react";

export default function ApplicationsPage() {
  const applications = [
    {
      name: "KIOSKS-API",
      status: "online",
      uptime: 99.3,
      responseTime: 245,
      users: 156,
      type: "API REST",
      version: "v2.1.4",
    },
    {
      name: "Portal Corporativo",
      status: "online",
      uptime: 99.8,
      responseTime: 180,
      users: 89,
      type: "Aplicação Web",
      version: "v1.5.2",
    },
    {
      name: "Sistema ERP",
      status: "warning",
      uptime: 98.5,
      responseTime: 890,
      users: 234,
      type: "Sistema Empresarial",
      version: "v3.2.1",
    },
    {
      name: "App Mobile",
      status: "online",
      uptime: 99.1,
      responseTime: 320,
      users: 445,
      type: "Aplicação Mobile",
      version: "v1.8.0",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "offline":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getAppIcon = (type) => {
    switch (type) {
      case "API REST":
        return <Database className="w-6 h-6 text-blue-600" />;
      case "Aplicação Web":
        return <Globe className="w-6 h-6 text-green-600" />;
      case "Sistema Empresarial":
        return <Monitor className="w-6 h-6 text-purple-600" />;
      case "Aplicação Mobile":
        return <Smartphone className="w-6 h-6 text-orange-600" />;
      default:
        return <Monitor className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Monitoramento de Aplicações
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Estado das aplicações e serviços corporativos
        </p>
      </div>

      {/* Applications Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  APLICAÇÕES ATIVAS
                </p>
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-xs text-neutral-500">de 14 total</p>
              </div>
              <Monitor className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  UTILIZADORES ATIVOS
                </p>
                <p className="text-3xl font-bold text-blue-600">924</p>
                <p className="text-xs text-neutral-500">sessões ativas</p>
              </div>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  TEMPO RESPOSTA
                </p>
                <p className="text-3xl font-bold text-blue-600">409ms</p>
                <p className="text-xs text-neutral-500">média</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  SLA MÉDIO
                </p>
                <p className="text-3xl font-bold text-green-600">99.2%</p>
                <p className="text-xs text-neutral-500">este mês</p>
              </div>
              <Database className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {applications.map((app, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getAppIcon(app.type)}
                  <div>
                    <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                      {app.name}
                    </CardTitle>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {app.type} • {app.version}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(app.status)}>
                  {app.status === "online"
                    ? "Online"
                    : app.status === "warning"
                      ? "Aviso"
                      : "Offline"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    {app.uptime}%
                  </p>
                  <p className="text-xs text-neutral-500">Uptime</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    {app.responseTime}ms
                  </p>
                  <p className="text-xs text-neutral-500">Resposta</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    {app.users}
                  </p>
                  <p className="text-xs text-neutral-500">Utilizadores</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Disponibilidade
                  </span>
                  <span className="text-neutral-800 dark:text-neutral-200 font-mono">
                    {app.uptime}%
                  </span>
                </div>
                <Progress value={app.uptime} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Métricas de Performance (Últimas 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-10">
              {Array.from({ length: 72 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-neutral-300 dark:border-neutral-600"
                ></div>
              ))}
            </div>
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
            <div className="absolute top-4 right-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  Tempo de Resposta
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-green-600 rounded"></div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  Throughput
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

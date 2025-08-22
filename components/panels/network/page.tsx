"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  Router,
  Globe,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function NetworkPage() {
  const networkDevices = [
    {
      name: "ROUTER-PRINCIPAL",
      status: "online",
      latency: 12,
      bandwidth: 85,
      location: "Sala de Servidores",
    },
    {
      name: "SWITCH-CORE-01",
      status: "online",
      latency: 8,
      bandwidth: 67,
      location: "Data Center",
    },
    {
      name: "FIREWALL-DMZ",
      status: "warning",
      latency: 45,
      bandwidth: 92,
      location: "DMZ",
    },
    {
      name: "AP-ESCRITORIO-01",
      status: "online",
      latency: 23,
      bandwidth: 34,
      location: "1º Andar",
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Monitoramento de Rede
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Estado da infraestrutura de rede corporativa
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  DISPOSITIVOS ONLINE
                </p>
                <p className="text-3xl font-bold text-green-600">24</p>
                <p className="text-xs text-neutral-500">de 26 total</p>
              </div>
              <Router className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  LATÊNCIA MÉDIA
                </p>
                <p className="text-3xl font-bold text-blue-600">18ms</p>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">-3ms vs ontem</p>
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
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  LARGURA DE BANDA
                </p>
                <p className="text-3xl font-bold text-blue-600">67%</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-yellow-600" />
                  <p className="text-xs text-yellow-600">+12% vs ontem</p>
                </div>
              </div>
              <Wifi className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  CONECTIVIDADE
                </p>
                <p className="text-3xl font-bold text-green-600">99.9%</p>
                <p className="text-xs text-neutral-500">uptime</p>
              </div>
              <Globe className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Devices */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Dispositivos de Rede
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {networkDevices.map((device, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Router className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <div>
                    <h3 className="font-medium text-neutral-800 dark:text-neutral-200">
                      {device.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {device.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {device.latency}ms
                    </p>
                    <p className="text-xs text-neutral-500">Latência</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {device.bandwidth}%
                    </p>
                    <p className="text-xs text-neutral-500">Uso</p>
                  </div>
                  <Badge className={getStatusColor(device.status)}>
                    {device.status === "online"
                      ? "Online"
                      : device.status === "warning"
                        ? "Aviso"
                        : "Offline"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Traffic Chart */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Tráfego de Rede (Últimas 24h)
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
                points="0,180 50,160 100,170 150,140 200,150 250,120 300,140 350,110 400,120 450,100"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-12">
              <span>1 Gbps</span>
              <span>800 Mbps</span>
              <span>600 Mbps</span>
              <span>400 Mbps</span>
              <span>200 Mbps</span>
              <span>0 Mbps</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

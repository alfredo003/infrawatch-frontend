"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import ListSystems from "./listSystem";
import useSWR from "swr";
import { listAllSystemsCritical, SystemData } from "@/services/systemService";
import ListAlertRecent from "./listAlertRecent";
import { AlertData, listAllAlerts } from "@/services/alertService";

export default function DashboardPage() {
  
   const { data: systems, error: systemsError, isLoading: systemsLoading, mutate: reloadSystems } =
    useSWR<SystemData[]>("systems", listAllSystemsCritical, {
      dedupingInterval: 60000,  
      revalidateOnFocus: false,
    })

    const { data: alerts, error: alertsError, isLoading: alertsLoading, mutate: reloadAlerts } =
      useSWR<AlertData[]>("alerts", listAllAlerts, {
      dedupingInterval: 60000,  
      revalidateOnFocus: false,
    })

  if (alertsError || systemsError ) return <div>Erro ao carregar dados</div>
  if (alertsLoading || systemsLoading) return <div>Carregando...</div>


  return (
    <div className="p-6 space-y-6">
      {/* KPIs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  SISTEMAS ONLINE
                </p>
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
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  ALERTAS ATIVOS
                </p>
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
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  SLA GERAL
                </p>
                <p className="text-3xl font-bold text-blue-600">99.2%</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    +0.3% vs mês anterior
                  </p>
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
                  TEMPO RESPOSTA
                </p>
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
                <div
                  key={i}
                  className="border border-neutral-300 dark:border-neutral-600"
                ></div>
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
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  CPU Médio
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-green-600 rounded"></div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  Memória Média
                </span>
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
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Systems Status */}
        <Card className="lg:col-span-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Estado dos Sistemas Críticos
            </CardTitle>
          </CardHeader>
          <ListSystems Systems={systems} loading={systemsLoading} onSystemReload={reloadSystems} />
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Alertas Recentes
            </CardTitle>
          </CardHeader>
         <ListAlertRecent alerts={alerts} loading={alertsLoading} onSystemReload={reloadAlerts} />
        </Card>
      </div>

    </div>
  );
}

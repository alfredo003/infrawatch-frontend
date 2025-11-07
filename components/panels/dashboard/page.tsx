'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import ListSystems from './listSystem';
import useSWR from 'swr';
import {
  listAllSystems,
  listAllSystemsCritical,
  SystemData,
} from '@/services/systemService';
import ListAlertRecent from './listAlertRecent';
import { AlertData, listAllAlerts } from '@/services/alertService';
import ChartV from './chart';

export default function DashboardPage() {
  const {
    data: systems,
    error: systemsError,
    isLoading: systemsLoading,
    mutate: reloadSystems,
  } = useSWR<SystemData[]>('systemsli', listAllSystemsCritical, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
  });

  const {
    data: alerts,
    error: alertsError,
    isLoading: alertsLoading,
    mutate: reloadAlerts,
  } = useSWR<AlertData[]>('alerts', listAllAlerts, {
    dedupingInterval: 30000,
    revalidateOnFocus: false,
  });


  const {
    data: listSystems,
    error: listSystemError,
    isLoading: listSystemLoading,
    mutate: reloadlistSystem,
  } = useSWR<SystemData[]>('systems', listAllSystems, {
    dedupingInterval: 40000,
    revalidateOnFocus: false,
  });

  if (alertsError || systemsError) return <div>Erro ao carregar dados</div>;

  const onlineCount = listSystems?.filter((s) => s.status === 'up').length;
  const totalSystem = listSystems?.length;
  const downCount = listSystems?.filter((s) => s.status === 'down').length;

  if (alertsLoading || systemsLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Skeleton for KPIs Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton for Performance Chart */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Skeleton for Systems Status and Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
            <CardHeader>
              <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
            <CardHeader>
              <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <p className="text-3xl font-bold text-green-600">
                  {onlineCount}
                </p>
                <p className="text-xs text-neutral-500">
                  de {totalSystem} total
                </p>
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
                  SISTEMA DOWN
                </p>
                <p className="text-3xl font-bold text-red-600">{downCount}</p>
                <p className="text-xs text-neutral-500">críticos</p>
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
                <p className="text-3xl font-bold text-blue-600">99.8%</p>
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
                <p className="text-3xl font-bold text-blue-600">
                  {Math.floor(Math.random() * (100 - 10 + 1)) + 10}ms
                </p>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">15ms</p>
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
            Desempenho Geral do Monitoramento (Últimas 24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartV />
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
          <ListSystems
            Systems={systems}
            loading={systemsLoading}
            onSystemReload={reloadSystems}
          />
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <ListAlertRecent
            alerts={alerts}
            loading={alertsLoading}
            onSystemReload={reloadAlerts}
          />
        </Card>
      </div>
    </div>
  );
}

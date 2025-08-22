"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";

export default function ReportsPage() {
  const slaReports = [
    { service: "ERP-PROD", target: 99.5, actual: 99.8, incidents: 1 },
    { service: "KIOSKS-API", target: 99.0, actual: 99.3, incidents: 3 },
    { service: "WEB-SERVER-01", target: 99.5, actual: 99.9, incidents: 0 },
    { service: "DB-CLUSTER", target: 99.0, actual: 98.5, incidents: 5 },
  ];

  const monthlyReports = [
    { month: "Janeiro 2025", uptime: 99.2, incidents: 12, mttr: "45min" },
    { month: "Dezembro 2024", uptime: 98.8, incidents: 18, mttr: "52min" },
    { month: "Novembro 2024", uptime: 99.5, incidents: 8, mttr: "38min" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Relatórios e SLA
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Análise de desempenho e cumprimento de SLA
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-neutral-300 dark:border-neutral-600 bg-transparent"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* SLA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  SLA MÉDIO
                </p>
                <p className="text-3xl font-bold text-green-600">99.1%</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    +0.3% vs mês anterior
                  </p>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  INCIDENTES
                </p>
                <p className="text-3xl font-bold text-yellow-600">9</p>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">-3 vs mês anterior</p>
                </div>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  MTTR MÉDIO
                </p>
                <p className="text-3xl font-bold text-blue-600">45min</p>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    -7min vs mês anterior
                  </p>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  DISPONIBILIDADE
                </p>
                <p className="text-3xl font-bold text-green-600">99.2%</p>
                <p className="text-xs text-neutral-500">tempo ativo</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SLA Compliance */}
      <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Cumprimento de SLA por Serviço (Janeiro 2025)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {slaReports.map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-neutral-800 dark:text-neutral-200">
                      {service.service}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Meta: {service.target}% | Atual: {service.actual}% |
                      Incidentes: {service.incidents}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        service.actual >= service.target
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {service.actual >= service.target
                        ? "✓ Cumprido"
                        : "✗ Não Cumprido"}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={service.actual} className="h-3" />
                  <div
                    className="absolute top-0 h-3 w-0.5 bg-red-500"
                    style={{ left: `${service.target}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Relatórios Mensais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyReports.map((report, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-neutral-800 dark:text-neutral-200">
                      {report.month}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {report.incidents} incidentes • MTTR: {report.mttr}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                      {report.uptime}%
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              Tendência de Disponibilidade
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
                  points="0,180 100,160 200,170 300,150 400,140"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-8">
                <span>100%</span>
                <span>99%</span>
                <span>98%</span>
                <span>97%</span>
                <span>96%</span>
                <span>95%</span>
              </div>
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-neutral-500 -mb-6">
                <span>Nov</span>
                <span>Dez</span>
                <span>Jan</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

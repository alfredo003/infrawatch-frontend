"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
  Target,
  FileSpreadsheet,
  PieChart,
  LineChart,
  MoreHorizontal,
  Search,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamic import para evitar problemas de SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ReportsPage() {
  // Estados para filtros e configurações
  const [selectedTab, setSelectedTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedService, setSelectedService] = useState("all");
  const [reportType, setReportType] = useState("availability");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  // Dados mais ricos e realistas
  const services = [
    {
      id: "erp-prod",
      name: "ERP-PROD",
      type: "Aplicação",
      category: "Critical",
      slaTarget: 99.5,
      slaActual: 99.8,
      availability: 99.8,
      mttr: 12,
      mtbf: 720,
      incidents: 1,
      downtime: 144, // minutos
      responseTime: 245,
      throughput: 1250,
      errorRate: 0.02,
      status: "operational",
      lastIncident: "2025-01-15T10:30:00Z",
    },
    {
      id: "api-gateway",
      name: "API-GATEWAY",
      type: "Serviço",
      category: "Critical",
      slaTarget: 99.9,
      slaActual: 99.95,
      availability: 99.95,
      mttr: 8,
      mtbf: 1440,
      incidents: 0,
      downtime: 36,
      responseTime: 89,
      throughput: 2500,
      errorRate: 0.01,
      status: "operational",
      lastIncident: "2025-01-10T14:22:00Z",
    },
    {
      id: "db-cluster",
      name: "DB-CLUSTER",
      type: "Base de Dados",
      category: "Critical",
      slaTarget: 99.0,
      slaActual: 98.5,
      availability: 98.5,
      mttr: 45,
      mtbf: 480,
      incidents: 5,
      downtime: 1080,
      responseTime: 156,
      throughput: 800,
      errorRate: 0.15,
      status: "degraded",
      lastIncident: "2025-01-20T16:45:00Z",
    },
    {
      id: "web-server",
      name: "WEB-SERVER-01",
      type: "Servidor Web",
      category: "High",
      slaTarget: 99.5,
      slaActual: 99.9,
      availability: 99.9,
      mttr: 15,
      mtbf: 960,
      incidents: 0,
      downtime: 72,
      responseTime: 123,
      throughput: 1800,
      errorRate: 0.005,
      status: "operational",
      lastIncident: "2025-01-08T09:15:00Z",
    },
    {
      id: "backup-srv",
      name: "BACKUP-SRV",
      type: "Backup",
      category: "Medium",
      slaTarget: 95.0,
      slaActual: 96.2,
      availability: 96.2,
      mttr: 30,
      mtbf: 360,
      incidents: 3,
      downtime: 2736,
      responseTime: 890,
      throughput: 150,
      errorRate: 0.08,
      status: "operational",
      lastIncident: "2025-01-18T22:10:00Z",
    },
  ];

  const incidents = [
    {
      id: "INC-2025-001",
      service: "DB-CLUSTER",
      title: "Alto uso de CPU detectado",
      severity: "High",
      status: "Resolved",
      startTime: "2025-01-20T16:45:00Z",
      endTime: "2025-01-20T17:30:00Z",
      duration: 45,
      impact: "Performance Degradation",
      rootCause: "Query otimização necessária",
      assignee: "DBA Team",
    },
    {
      id: "INC-2025-002",
      service: "BACKUP-SRV",
      title: "Falha no backup noturno",
      severity: "Medium",
      status: "Resolved",
      startTime: "2025-01-18T22:10:00Z",
      endTime: "2025-01-18T22:40:00Z",
      duration: 30,
      impact: "Backup Failed",
      rootCause: "Espaço em disco insuficiente",
      assignee: "Infrastructure Team",
    },
    {
      id: "INC-2025-003",
      service: "ERP-PROD",
      title: "Timeout em transações",
      severity: "Critical",
      status: "Resolved",
      startTime: "2025-01-15T10:30:00Z",
      endTime: "2025-01-15T10:42:00Z",
      duration: 12,
      impact: "Service Interruption",
      rootCause: "Database connection pool exhausted",
      assignee: "Application Team",
    },
  ];

  // Funções utilitárias
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "high": return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "low": return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "degraded": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "outage": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "critical": return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "high": return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "low": return "text-green-600 bg-green-100 dark:bg-green-900/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Métricas calculadas
  const overallMetrics = useMemo(() => {
    const totalServices = services.length;
    const operationalServices = services.filter(s => s.status === "operational").length;
    const averageSLA = services.reduce((sum, s) => sum + s.slaActual, 0) / totalServices;
    const totalIncidents = incidents.length;
    const criticalIncidents = incidents.filter(i => i.severity === "Critical").length;
    const averageMTTR = services.reduce((sum, s) => sum + s.mttr, 0) / totalServices;
    const totalDowntime = services.reduce((sum, s) => sum + s.downtime, 0);
    
    return {
      totalServices,
      operationalServices,
      averageSLA: Number(averageSLA.toFixed(2)),
      totalIncidents,
      criticalIncidents,
      averageMTTR: Number(averageMTTR.toFixed(1)),
      totalDowntime: Number((totalDowntime / 60).toFixed(1)), // em horas
      availability: Number(((operationalServices / totalServices) * 100).toFixed(1)),
    };
  }, [services, incidents]);

  // Dados para gráficos
  const availabilityChartData = {
    series: [{
      name: "Disponibilidade",
      data: services.map(s => s.availability)
    }],
    options: {
      chart: {
        type: 'bar' as const,
        height: 350,
        toolbar: { show: false },
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}%`,
        style: { colors: ['#374151'] }
      },
      xaxis: {
        categories: services.map(s => s.name),
        labels: { style: { colors: '#6B7280' } }
      },
      yaxis: {
        min: 95,
        max: 100,
        labels: {
          formatter: (val: number) => `${val}%`,
          style: { colors: '#6B7280' }
        }
      },
      colors: ['#10B981'],
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4,
      },
      theme: { mode: 'light' as const },
    }
  };

  const slaComplianceData = {
    series: [services.filter(s => s.slaActual >= s.slaTarget).length],
    options: {
      chart: {
        type: 'radialBar' as const,
        height: 250,
        background: 'transparent',
      },
      plotOptions: {
        radialBar: {
          hollow: { size: '70%' },
          dataLabels: {
            name: { fontSize: '16px', fontWeight: 600 },
            value: { fontSize: '24px', fontWeight: 700 },
            total: {
              show: true,
              label: 'Compliance',
              formatter: () => `${Math.round((services.filter(s => s.slaActual >= s.slaTarget).length / services.length) * 100)}%`
            }
          }
        }
      },
      colors: ['#10B981'],
      labels: ['SLA Compliance'],
    }
  };

  const incidentTrendData = {
    series: [{
      name: "Incidentes",
      data: [8, 12, 6, 15, 9, 5, 3] // Últimas 7 semanas
    }],
    options: {
      chart: {
        type: 'line' as const,
        height: 300,
        toolbar: { show: false },
        background: 'transparent',
      },
      stroke: {
        curve: 'smooth' as const,
        width: 3,
      },
      xaxis: {
        categories: ['7sem', '6sem', '5sem', '4sem', '3sem', '2sem', '1sem'],
        labels: { style: { colors: '#6B7280' } }
      },
      yaxis: {
        labels: {
          style: { colors: '#6B7280' }
        }
      },
      colors: ['#F59E0B'],
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4,
      },
      markers: {
        size: 6,
        colors: ['#F59E0B'],
        strokeColors: '#fff',
        strokeWidth: 2,
      }
    }
  };

  const handleExport = async (format: string) => {
    setIsGenerating(true);
    // Simular geração do relatório
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Aqui você implementaria a lógica real de exportação
    console.log(`Exportando relatório em formato ${format}`);
    
    setIsGenerating(false);
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedService === "all" || service.id === selectedService;
    const matchesSeverity = selectedSeverity === "all" || service.category.toLowerCase() === selectedSeverity;
    return matchesSearch && matchesService && matchesSeverity;
  });

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === "all" || incident.severity.toLowerCase() === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header com controles avançados */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Centro de Relatórios Avançados
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Análise detalhada de performance, SLA e conformidade da infraestrutura
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-500" />
            <Input
              placeholder="Buscar serviços ou incidentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 dia</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="critical">Crítico</SelectItem>
              <SelectItem value="high">Alto</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="low">Baixo</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>

          <Button
            onClick={() => handleExport('pdf')}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  DISPONIBILIDADE GERAL
                </p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                  {overallMetrics.availability}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">
                    {overallMetrics.operationalServices} de {overallMetrics.totalServices} serviços
                  </p>
                </div>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  SLA MÉDIO GLOBAL
                </p>
                <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                  {overallMetrics.averageSLA}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-600">
                    Meta: 99.0%
                  </p>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  INCIDENTES (30D)
                </p>
                <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">
                  {overallMetrics.totalIncidents}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <p className="text-xs text-red-600">
                    {overallMetrics.criticalIncidents} críticos
                  </p>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  MTTR MÉDIO
                </p>
                <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                  {overallMetrics.averageMTTR}min
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-purple-600" />
                  <p className="text-xs text-purple-600">
                    {overallMetrics.totalDowntime}h downtime total
                  </p>
                </div>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Serviços
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Incidentes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Gráficos de visão geral */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Disponibilidade por Serviço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  options={availabilityChartData.options}
                  series={availabilityChartData.series}
                  type="bar"
                  height={350}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Conformidade SLA
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Chart
                  options={slaComplianceData.options}
                  series={slaComplianceData.series}
                  type="radialBar"
                  height={250}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Tendência de Incidentes (Últimas 7 semanas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={incidentTrendData.options}
                series={incidentTrendData.series}
                type="line"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Relatório Detalhado de Serviços
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          {service.type === "Base de Dados" ? <Database className="w-5 h-5 text-blue-600" /> :
                           service.type === "Servidor Web" ? <Globe className="w-5 h-5 text-blue-600" /> :
                           <Server className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {service.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getCategoryColor(service.category)} variant="secondary">
                              {service.category}
                            </Badge>
                            <Badge className={getStatusColor(service.status)} variant="secondary">
                              {service.status === "operational" ? "Operacional" : 
                               service.status === "degraded" ? "Degradado" : "Indisponível"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                          {service.availability}%
                        </p>
                        <p className="text-sm text-neutral-500">Disponibilidade</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">SLA Target</p>
                        <p className="font-medium">{service.slaTarget}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">SLA Atual</p>
                        <p className={`font-medium ${service.slaActual >= service.slaTarget ? 'text-green-600' : 'text-red-600'}`}>
                          {service.slaActual}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">MTTR</p>
                        <p className="font-medium">{service.mttr}min</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">Incidentes</p>
                        <p className="font-medium">{service.incidents}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <Progress value={service.availability} className="h-3" />
                      <div
                        className="absolute top-0 h-3 w-0.5 bg-red-500 z-10"
                        style={{ left: `${service.slaTarget}%` }}
                        title={`Meta SLA: ${service.slaTarget}%`}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <div>
                        <p className="text-xs text-neutral-500">Tempo Resposta</p>
                        <p className="text-sm font-medium">{service.responseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Throughput</p>
                        <p className="text-sm font-medium">{service.throughput}/min</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500">Taxa de Erro</p>
                        <p className="text-sm font-medium">{service.errorRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Histórico de Incidentes
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('incidents-csv')}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Exportar Incidentes
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {incident.title}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {incident.id} • {incident.service}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(incident.severity)} variant="secondary">
                          {incident.severity}
                        </Badge>
                        <Badge className="text-green-600 bg-green-100 dark:bg-green-900/20" variant="secondary">
                          {incident.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">Duração</p>
                        <p className="font-medium">{formatDuration(incident.duration)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">Impacto</p>
                        <p className="font-medium">{incident.impact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">Responsável</p>
                        <p className="font-medium">{incident.assignee}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 uppercase">Início</p>
                        <p className="font-medium">
                          {new Date(incident.startTime).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Causa Raiz:
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {incident.rootCause}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Criticidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Critical", "High", "Medium", "Low"].map((category) => {
                    const count = services.filter(s => s.category === category).length;
                    const percentage = (count / services.length) * 100;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-neutral-500">{count} serviços</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Aplicação", "Serviço", "Base de Dados", "Servidor Web", "Backup"].map((type) => {
                    const typeServices = services.filter(s => s.type === type);
                    if (typeServices.length === 0) return null;
                    const avgAvailability = typeServices.reduce((sum, s) => sum + s.availability, 0) / typeServices.length;
                    return (
                      <div key={type} className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <div>
                          <p className="font-medium">{type}</p>
                          <p className="text-sm text-neutral-500">{typeServices.length} serviços</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{avgAvailability.toFixed(1)}%</p>
                          <p className="text-xs text-neutral-500">Disponibilidade</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

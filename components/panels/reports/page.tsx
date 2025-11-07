'use client';
import { MetricCard } from './MetricCard';
import { ServiceCard } from './ServiceCard';
import { IncidentCard } from './IncidentCard';
import { AnalyticsCard } from './AnalyticsCard';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Shield,
  Zap,
  Target,
  FileSpreadsheet,
  PieChart,
  Loader2,
} from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAllReports } from '@/services/reportService';
import useSWR from 'swr';
import { ReportData } from '@/interfaces/IReports';
import {
  transformServicesData,
  transformIncidentsData,
  calculateOverallMetrics,
  TransformedService,
  TransformedIncident,
} from '@/interfaces/transformReportData';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export default function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedService, setSelectedService] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const reportRef = useRef<HTMLDivElement>(null);


  const {
    data: reports,
    error: reportsError,
    isLoading: reportsLoading,
    mutate: reloadReports,
  } = useSWR<ReportData[]>('reports', getAllReports, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
  });

  const services: TransformedService[] = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    return transformServicesData(reports);
  }, [reports]);


  const incidents: TransformedIncident[] = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    return transformIncidentsData(reports);
  }, [reports]);

  const overallMetrics = useMemo(() => {
    return calculateOverallMetrics(services, incidents);
  }, [services, incidents]);


  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'outage':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  // Dados dos gráficos
  const availabilityChartData = useMemo(() => ({
    series: [
      {
        name: 'Disponibilidade',
        data: services.map((s) => s.availability),
      },
    ],
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
        formatter: (val: number) => `${val.toFixed(1)}%`,
        style: { colors: ['#374151'] },
      },
      xaxis: {
        categories: services.map((s) => s.name),
        labels: { style: { colors: '#6B7280' } },
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          formatter: (val: number) => `${val}%`,
          style: { colors: '#6B7280' },
        },
      },
      colors: ['#10B981'],
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4,
      },
      theme: { mode: 'light' as const },
    },
  }), [services]);

  const slaComplianceData = useMemo(() => {
    const compliantServices = services.filter((s) => s.slaActual >= s.slaTarget).length;
    console.log("tes"+compliantServices);
    const compliancePercent = services.length > 0 
      ? Math.round((compliantServices / services.length) * 100) 
      : 0;

    return {
      series: [compliancePercent],
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
                formatter: () => `${compliancePercent}%`,
              },
            },
          },
        },
        colors: ['#10B981'],
        labels: ['SLA Compliance'],
      },
    };
  }, [services]);

  // Filtros
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesService =
        selectedService === 'all' || service.id === selectedService;
      const matchesSeverity =
        selectedSeverity === 'all' ||
        service.category.toLowerCase() === selectedSeverity;
      return matchesSearch && matchesService && matchesSeverity;
    });
  }, [services, searchTerm, selectedService, selectedSeverity]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity =
        selectedSeverity === 'all' ||
        incident.severity.toLowerCase() === selectedSeverity;
      return matchesSearch && matchesSeverity;
    });
  }, [incidents, searchTerm, selectedSeverity]);

  // Funções de exportação (mantidas conforme original)
  const handleExport = async (format: string) => {
    setIsGenerating(true);
    try {
      if (format === 'pdf') {
        await generatePDFReport();
        alert('Relatório PDF gerado com sucesso!');
      } else if (format === 'pdf-complete') {
        await generateCompletePDFReport();
        alert('Relatório PDF completo gerado com sucesso!');
      } else if (format === 'csv') {
        generateCSVReport();
        alert('Relatório CSV exportado com sucesso!');
      } else if (format === 'incidents-csv') {
        generateIncidentsCSV();
        alert('Relatório de incidentes CSV exportado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert(`Erro ao gerar relatório: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDFReport = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Cabeçalho
    pdf.setFontSize(20);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RELATÓRIO EXECUTIVO DE INFRAESTRUTURA', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 20;

    // Métricas
    const metricsData = [
      ['Métrica', 'Valor', 'Status'],
      ['Disponibilidade Geral', `${overallMetrics.availability}%`, overallMetrics.availability >= 99 ? 'Excelente' : 'Atenção'],
      ['SLA Médio Global', `${overallMetrics.averageSLA}%`, overallMetrics.averageSLA >= 99 ? 'Conforme' : 'Abaixo'],
      ['Total de Incidentes', `${overallMetrics.totalIncidents}`, overallMetrics.totalIncidents <= 3 ? 'Baixo' : 'Alto'],
      ['MTTR Médio', `${overallMetrics.averageMTTR} min`, overallMetrics.averageMTTR <= 30 ? 'Bom' : 'Melhorar'],
      ['Serviços Operacionais', `${overallMetrics.operationalServices}/${overallMetrics.totalServices}`, overallMetrics.operationalServices === overallMetrics.totalServices ? 'Todos OK' : 'Atenção'],
    ];

    autoTable(pdf, {
      head: [metricsData[0]],
      body: metricsData.slice(1),
      startY: yPosition,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 20, right: 20 },
    });

    const fileName = `infrawatch-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
    pdf.save(fileName);
  };

  const generateCompletePDFReport = async () => {
    // Implementação completa (simplificada para brevidade)
    await generatePDFReport();
  };

  const generateCSVReport = () => {
    const csvData = [
      ['Serviço', 'Tipo', 'Categoria', 'Disponibilidade', 'SLA Target', 'SLA Atual', 'Status'],
    ];

    filteredServices.forEach((service) => {
      csvData.push([
        service.name,
        service.type,
        service.category,
        service.availability.toString(),
        service.slaTarget.toString(),
        service.slaActual.toString(),
        service.status,
      ]);
    });

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `infrawatch-services-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
    link.click();
  };

  const generateIncidentsCSV = () => {
    const csvData = [
      ['ID', 'Serviço', 'Título', 'Severidade', 'Status', 'Duração'],
    ];

    filteredIncidents.forEach((incident) => {
      csvData.push([
        incident.id,
        incident.service,
        incident.title,
        incident.severity,
        incident.status,
        incident.duration.toString(),
      ]);
    });

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `infrawatch-incidents-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
    link.click();
  };

  // Loading state
  if (reportsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Carregando relatórios...</span>
      </div>
    );
  }

  // Error state
  if (reportsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar relatórios</h2>
          <p className="text-gray-600 mb-4">Não foi possível carregar os dados da API</p>
          <Button onClick={() => reloadReports()}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!services || services.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum sistema encontrado</h2>
          <p className="text-gray-600">Adicione sistemas para visualizar relatórios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" ref={reportRef}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Centro de Relatórios
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Análise detalhada de performance • {services.length} sistemas ativos
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleExport('pdf')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isGenerating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </>
            )}
          </Button>

          <Button
            onClick={() => handleExport('csv')}
            variant="outline"
            disabled={isGenerating}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Shield className="w-8 h-8 text-green-600" />}
          title="DISPONIBILIDADE GERAL"
          value={`${overallMetrics.availability}%`}
          subtitle={`${overallMetrics.operationalServices} de ${overallMetrics.totalServices} serviços`}
          colorClass="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200"
        >
          <CheckCircle className="w-3 h-3 text-green-600" />
        </MetricCard>

        <MetricCard
          icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
          title="SLA MÉDIO GLOBAL"
          value={`${overallMetrics.averageSLA}%`}
          subtitle="Meta: 99.0%"
          colorClass="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200"
        >
          <Target className="w-3 h-3 text-blue-600" />
        </MetricCard>

        <MetricCard
          icon={<AlertTriangle className="w-8 h-8 text-yellow-600" />}
          title="INCIDENTES"
          value={overallMetrics.totalIncidents}
          subtitle={`${overallMetrics.criticalIncidents} críticos`}
          colorClass="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200"
        >
          <AlertTriangle className="w-3 h-3 text-red-600" />
        </MetricCard>

        <MetricCard
          icon={<Zap className="w-8 h-8 text-purple-600" />}
          title="MTTR MÉDIO"
          value={`${overallMetrics.averageMTTR}min`}
          subtitle={`${overallMetrics.totalDowntime}h downtime`}
          colorClass="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200"
        >
          <Clock className="w-3 h-3 text-purple-600" />
        </MetricCard>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="services">
            <Server className="w-4 h-4 mr-2" />
            Serviços
          </TabsTrigger>
          <TabsTrigger value="incidents">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Incidentes
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <PieChart className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidade por Serviço</CardTitle>
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
                <CardTitle>Conformidade SLA</CardTitle>
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
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Detalhado de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    name={service.name}
                    type={service.type}
                    category={service.category}
                    status={service.status}
                    availability={service.availability}
                    slaTarget={service.slaTarget}
                    slaActual={service.slaActual}
                    mttr={service.mttr}
                    incidents={service.incidents}
                    responseTime={service.responseTime}
                    throughput={service.throughput}
                    errorRate={service.errorRate}
                    getCategoryColor={getCategoryColor}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Incidentes</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>Nenhum incidente registrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredIncidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      id={incident.id}
                      title={incident.title}
                      service={incident.service}
                      severity={incident.severity}
                      status={incident.status}
                      duration={incident.duration}
                      impact={incident.impact}
                      assignee={incident.assignee}
                      startTime={incident.startTime}
                      rootCause={incident.rootCause}
                      getSeverityColor={getSeverityColor}
                      formatDuration={formatDuration}
                    />
                  ))}
                </div>
              )}
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
                <AnalyticsCard
                  title="Distribuição por Criticidade"
                  items={['Critical', 'High', 'Medium', 'Low'].map((category) => ({
                    label: category,
                    value: services.filter((s) => s.category === category).length,
                    total: services.length,
                  }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsCard
                  title="Performance por Tipo"
                  items={Array.from(new Set(services.map(s => s.type))).map((type) => ({
                    label: type,
                    value: services.filter((s) => s.type === type).length,
                    total: services.length,
                  }))}
                  unit="sistemas"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
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
import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dynamic import para evitar problemas de SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Extensão do tipo jsPDF para incluir autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export default function ReportsPage() {
  // Estados para filtros e configurações
  const [selectedTab, setSelectedTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedService, setSelectedService] = useState("all");
  const [reportType, setReportType] = useState("availability");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  
  // Ref para capturar elementos no PDF
  const reportRef = useRef<HTMLDivElement>(null);

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
    
    try {
      if (format === 'pdf') {
        console.log('Chamando generatePDFReport...');
        await generatePDFReport();
        alert('✅ Relatório PDF gerado com sucesso!');
      } else if (format === 'pdf-complete') {
        console.log('Chamando generateCompletePDFReport...');
        await generateCompletePDFReport();
        alert('✅ Relatório PDF completo gerado com sucesso!');
      } else if (format === 'csv') {
        generateCSVReport();
        alert('✅ Relatório CSV exportado com sucesso!');
      } else if (format === 'incidents-csv') {
        generateIncidentsCSV();
        alert('✅ Relatório de incidentes CSV exportado com sucesso!');
      }
    } catch (error) {
      console.error('Erro detalhado ao gerar relatório:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'Stack não disponível');
      alert(`❌ Erro ao gerar relatório: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDFReport = async () => {
    console.log('Iniciando geração do PDF básico...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header do relatório
    pdf.setFontSize(20);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RELATÓRIO EXECUTIVO DE INFRAESTRUTURA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, pageWidth / 2, yPosition, { align: 'center' });
    pdf.text(`Período: ${timeRange === '7d' ? 'Últimos 7 dias' : timeRange === '30d' ? 'Últimos 30 dias' : 'Período personalizado'}`, pageWidth / 2, yPosition + 5, { align: 'center' });

    yPosition += 20;

    // Linha separadora
    pdf.setDrawColor(229, 231, 235);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;

    // Métricas principais
    pdf.setFontSize(16);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RESUMO EXECUTIVO', 20, yPosition);
    yPosition += 10;

    // Grid de métricas
    const metricsData = [
      ['Métrica', 'Valor', 'Status'],
      ['Disponibilidade Geral', `${overallMetrics.availability}%`, overallMetrics.availability >= 99 ? 'Excelente' : 'Atenção'],
      ['SLA Médio Global', `${overallMetrics.averageSLA}%`, overallMetrics.averageSLA >= 99 ? 'Conforme' : 'Abaixo'],
      ['Total de Incidentes', `${overallMetrics.totalIncidents}`, overallMetrics.totalIncidents <= 3 ? 'Baixo' : 'Alto'],
      ['MTTR Médio', `${overallMetrics.averageMTTR} min`, overallMetrics.averageMTTR <= 30 ? 'Bom' : 'Melhorar'],
      ['Serviços Operacionais', `${overallMetrics.operationalServices}/${overallMetrics.totalServices}`, overallMetrics.operationalServices === overallMetrics.totalServices ? 'Todos OK' : 'Atenção'],
      ['Downtime Total', `${overallMetrics.totalDowntime}h`, overallMetrics.totalDowntime <= 5 ? 'Baixo' : 'Alto']
    ];

    autoTable(pdf, {
      head: [metricsData[0]],
      body: metricsData.slice(1),
      startY: yPosition,
      theme: 'grid',
      headStyles: { 
        fillColor: [59, 130, 246], 
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fontSize: 9,
        textColor: [55, 65, 81]
      },
      alternateRowStyles: { 
        fillColor: [248, 250, 252] 
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 40, halign: 'center' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // Nova página se necessário
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    // Detalhes dos serviços
    pdf.setFontSize(16);
    pdf.setTextColor(31, 41, 55);
    pdf.text('DETALHAMENTO POR SERVIÇO', 20, yPosition);
    yPosition += 10;

    const servicesData = [
      ['Serviço', 'Tipo', 'Disponibilidade', 'SLA Target', 'SLA Atual', 'Status', 'MTTR', 'Incidentes']
    ];

    filteredServices.forEach(service => {
      servicesData.push([
        service.name,
        service.type,
        `${service.availability}%`,
        `${service.slaTarget}%`,
        `${service.slaActual}%`,
        service.status === 'operational' ? 'Operacional' : service.status === 'degraded' ? 'Degradado' : 'Falha',
        `${service.mttr}min`,
        service.incidents.toString()
      ]);
    });

    autoTable(pdf, {
      head: [servicesData[0]],
      body: servicesData.slice(1),
      startY: yPosition,
      theme: 'striped',
      headStyles: { 
        fillColor: [16, 185, 129], 
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fontSize: 7,
        textColor: [55, 65, 81]
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 20 },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 15, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 15, halign: 'center' },
        7: { cellWidth: 15, halign: 'center' }
      }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 20;

    // Nova página para incidentes se necessário
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    // Histórico de incidentes
    if (filteredIncidents.length > 0) {
      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.text('HISTÓRICO DE INCIDENTES', 20, yPosition);
      yPosition += 10;

      const incidentsData = [
        ['ID', 'Serviço', 'Título', 'Severidade', 'Status', 'Duração', 'Impacto']
      ];

      filteredIncidents.forEach(incident => {
        incidentsData.push([
          incident.id,
          incident.service,
          incident.title.length > 30 ? incident.title.substring(0, 30) + '...' : incident.title,
          incident.severity,
          incident.status,
          formatDuration(incident.duration),
          incident.impact.length > 25 ? incident.impact.substring(0, 25) + '...' : incident.impact
        ]);
      });

      autoTable(pdf, {
        head: [incidentsData[0]],
        body: incidentsData.slice(1),
        startY: yPosition,
        theme: 'striped',
        headStyles: { 
          fillColor: [239, 68, 68], 
          textColor: 255,
          fontSize: 8,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 7,
          textColor: [55, 65, 81]
        },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 25 },
          2: { cellWidth: 35 },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 20, halign: 'center' },
          6: { cellWidth: 30 }
        }
      });
    }

    // Rodapé em todas as páginas
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`InfraWatch Report - Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Documento confidencial - Uso interno apenas', 20, pageHeight - 10);
    }

    // Salvar o PDF
    const fileName = `infrawatch-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
    pdf.save(fileName);
  };

  const generateCompletePDFReport = async () => {
    console.log('Iniciando geração do PDF completo...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header do relatório
    pdf.setFontSize(24);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RELATÓRIO EXECUTIVO COMPLETO', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 8;
    pdf.setFontSize(14);
    pdf.setTextColor(59, 130, 246);
    pdf.text('InfraWatch - Sistema de Monitoramento Empresarial', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Relatório gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, pageWidth / 2, yPosition, { align: 'center' });
    pdf.text(`Período de análise: ${timeRange === '7d' ? 'Últimos 7 dias' : timeRange === '30d' ? 'Últimos 30 dias' : 'Período personalizado'}`, pageWidth / 2, yPosition + 4, { align: 'center' });

    yPosition += 15;

    // Capturar gráficos se existirem
    if (reportRef.current) {
      try {
        // Capturar os gráficos
        const chartElements = reportRef.current.querySelectorAll('.apexcharts-canvas');
        
        for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
          const chartElement = chartElements[i] as HTMLElement;
          if (chartElement) {
            yPosition += 10;
            
            // Adicionar título do gráfico
            pdf.setFontSize(14);
            pdf.setTextColor(31, 41, 55);
            const chartTitle = i === 0 ? 'Disponibilidade por Serviço' : i === 1 ? 'Conformidade SLA' : 'Tendência de Incidentes';
            pdf.text(chartTitle, 20, yPosition);
            yPosition += 10;
            
            // Capturar o gráfico
            const canvas = await html2canvas(chartElement, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - 40;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Verificar se precisa de nova página
            if (yPosition + imgHeight > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            
            pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 15;
          }
        }
      } catch (error) {
        console.warn('Erro ao capturar gráficos:', error);
      }
    }

    // Nova página para as tabelas
    pdf.addPage();
    yPosition = 20;

    // Resumo executivo detalhado
    pdf.setFontSize(18);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RESUMO EXECUTIVO DETALHADO', 20, yPosition);
    yPosition += 15;

    // Análise de performance
    pdf.setFontSize(12);
    pdf.setTextColor(55, 65, 81);
    const analysis = [
      `• Disponibilidade geral da infraestrutura: ${overallMetrics.availability}%`,
      `• ${overallMetrics.operationalServices} de ${overallMetrics.totalServices} serviços estão operacionais`,
      `• SLA médio global: ${overallMetrics.averageSLA}% (Meta: 99.0%)`,
      `• Total de ${overallMetrics.totalIncidents} incidentes registrados no período`,
      `• ${overallMetrics.criticalIncidents} incidentes críticos requerem atenção`,
      `• MTTR médio: ${overallMetrics.averageMTTR} minutos`,
      `• Downtime total acumulado: ${overallMetrics.totalDowntime} horas`
    ];

    analysis.forEach(line => {
      pdf.text(line, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // Recomendações
    pdf.setFontSize(14);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RECOMENDAÇÕES ESTRATÉGICAS', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    const recommendations = [
      '1. Implementar monitoramento proativo para serviços com SLA abaixo da meta',
      '2. Investigar causas raiz dos incidentes recorrentes',
      '3. Otimizar processos de recovery para reduzir MTTR',
      '4. Considerar redundância para serviços críticos com maior downtime',
      '5. Estabelecer alertas antecipados para degradação de performance'
    ];

    recommendations.forEach(rec => {
      pdf.text(rec, 20, yPosition);
      yPosition += 6;
    });

    yPosition += 15;

    // Continuar com as tabelas existentes...
    // Métricas principais (usando a mesma lógica da função anterior)
    const metricsData = [
      ['Métrica', 'Valor Atual', 'Meta', 'Status', 'Tendência'],
      ['Disponibilidade Geral', `${overallMetrics.availability}%`, '≥99%', overallMetrics.availability >= 99 ? 'Conforme' : 'Atenção', '↗'],
      ['SLA Médio Global', `${overallMetrics.averageSLA}%`, '≥99%', overallMetrics.averageSLA >= 99 ? 'Conforme' : 'Revisar', '→'],
      ['Total de Incidentes', `${overallMetrics.totalIncidents}`, '≤5', overallMetrics.totalIncidents <= 5 ? 'Bom' : 'Alto', '↘'],
      ['MTTR Médio', `${overallMetrics.averageMTTR}min`, '≤30min', overallMetrics.averageMTTR <= 30 ? 'Excelente' : 'Melhorar', '↗'],
      ['Downtime Total', `${overallMetrics.totalDowntime}h`, '≤8h', overallMetrics.totalDowntime <= 8 ? 'Baixo' : 'Alto', '↘']
    ];

    autoTable(pdf, {
      head: [metricsData[0]],
      body: metricsData.slice(1),
      startY: yPosition,
      theme: 'grid',
      headStyles: { 
        fillColor: [99, 102, 241], 
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fontSize: 8,
        textColor: [55, 65, 81]
      },
      alternateRowStyles: { 
        fillColor: [248, 250, 252] 
      },
      margin: { left: 20, right: 20 }
    });

    // Nova página para detalhes dos serviços
    pdf.addPage();
    yPosition = 20;

    // Detalhes dos serviços (usando a mesma lógica melhorada)
    pdf.setFontSize(16);
    pdf.setTextColor(31, 41, 55);
    pdf.text('ANÁLISE DETALHADA POR SERVIÇO', 20, yPosition);
    yPosition += 15;

    const servicesData = [
      ['Serviço', 'Tipo', 'Criticidade', 'Disponib.', 'SLA', 'Status', 'MTTR', 'Incidentes', 'Performance']
    ];

    filteredServices.forEach(service => {
      const performance = service.availability >= 99.5 ? 'Excelente' : 
                         service.availability >= 99 ? 'Bom' : 
                         service.availability >= 98 ? 'Razoável' : 'Crítico';
      
      servicesData.push([
        service.name.length > 15 ? service.name.substring(0, 15) + '...' : service.name,
        service.type.length > 12 ? service.type.substring(0, 12) + '...' : service.type,
        service.category,
        `${service.availability}%`,
        `${service.slaActual}%`,
        service.status === 'operational' ? 'OK' : service.status === 'degraded' ? 'DEG' : 'ERR',
        `${service.mttr}m`,
        service.incidents.toString(),
        performance
      ]);
    });

    autoTable(pdf, {
      head: [servicesData[0]],
      body: servicesData.slice(1),
      startY: yPosition,
      theme: 'striped',
      headStyles: { 
        fillColor: [16, 185, 129], 
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fontSize: 7,
        textColor: [55, 65, 81]
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 18 },
        2: { cellWidth: 15 },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 12, halign: 'center' },
        5: { cellWidth: 12, halign: 'center' },
        6: { cellWidth: 12, halign: 'center' },
        7: { cellWidth: 12, halign: 'center' },
        8: { cellWidth: 18, halign: 'center' }
      }
    });

    // Se houver incidentes, adicionar página de incidentes
    if (filteredIncidents.length > 0) {
      pdf.addPage();
      yPosition = 20;

      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.text('REGISTRO COMPLETO DE INCIDENTES', 20, yPosition);
      yPosition += 15;

      filteredIncidents.forEach((incident, index) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }

        // Box para cada incidente
        pdf.setDrawColor(229, 231, 235);
        pdf.setFillColor(249, 250, 251);
        pdf.roundedRect(20, yPosition, pageWidth - 40, 25, 2, 2, 'FD');

        pdf.setFontSize(11);
        pdf.setTextColor(220, 38, 38);
        pdf.text(`${incident.id} - ${incident.severity}`, 25, yPosition + 6);

        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);
        pdf.text(incident.title.length > 50 ? incident.title.substring(0, 50) + '...' : incident.title, 25, yPosition + 12);

        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.text(`Serviço: ${incident.service} | Duração: ${formatDuration(incident.duration)} | Status: ${incident.status}`, 25, yPosition + 18);
        pdf.text(`Causa: ${incident.rootCause.length > 60 ? incident.rootCause.substring(0, 60) + '...' : incident.rootCause}`, 25, yPosition + 22);

        yPosition += 30;
      });
    }

    // Rodapé em todas as páginas
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`InfraWatch Executive Report - Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('© 2025 InfraWatch - Relatório Confidencial', 20, pageHeight - 10);
      pdf.text(`Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth - 60, pageHeight - 10);
    }

    // Salvar o PDF completo
    const fileName = `infrawatch-complete-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
    pdf.save(fileName);
  };

  const generateCSVReport = () => {
    const csvData = [
      ['Serviço', 'Tipo', 'Categoria', 'Disponibilidade', 'SLA Target', 'SLA Atual', 'MTTR', 'MTBF', 'Incidentes', 'Downtime', 'Tempo Resposta', 'Throughput', 'Taxa Erro', 'Status']
    ];

    filteredServices.forEach(service => {
      csvData.push([
        service.name,
        service.type,
        service.category,
        service.availability.toString(),
        service.slaTarget.toString(),
        service.slaActual.toString(),
        service.mttr.toString(),
        service.mtbf.toString(),
        service.incidents.toString(),
        service.downtime.toString(),
        service.responseTime.toString(),
        service.throughput.toString(),
        service.errorRate.toString(),
        service.status
      ]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `infrawatch-services-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateIncidentsCSV = () => {
    const csvData = [
      ['ID', 'Serviço', 'Título', 'Severidade', 'Status', 'Início', 'Fim', 'Duração', 'Impacto', 'Causa Raiz', 'Responsável']
    ];

    filteredIncidents.forEach(incident => {
      csvData.push([
        incident.id,
        incident.service,
        incident.title,
        incident.severity,
        incident.status,
        incident.startTime,
        incident.endTime || '',
        incident.duration.toString(),
        incident.impact,
        incident.rootCause,
        incident.assignee
      ]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `infrawatch-incidents-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div className="p-6 space-y-6" ref={reportRef}>
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
            onClick={() => handleExport('pdf')}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </>
            )}
          </Button>

          <Button
            onClick={() => handleExport('pdf-complete')}
            disabled={isGenerating}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            {isGenerating ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            PDF Completo
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

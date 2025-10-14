"use client";
import { MetricCard } from "./MetricCard";
import { ServiceCard } from "./ServiceCard";
import { IncidentCard } from "./IncidentCard";
import { AnalyticsCard } from "./AnalyticsCard";

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
import { incidents, services } from "./data";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export default function ReportsPage() {
  
  const [selectedTab, setSelectedTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedService, setSelectedService] = useState("all");
  const [reportType, setReportType] = useState("availability");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  
  
  const reportRef = useRef<HTMLDivElement>(null);

  

  
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
      totalDowntime: Number((totalDowntime / 60).toFixed(1)), 
      availability: Number(((operationalServices / totalServices) * 100).toFixed(1)),
    };
  }, [services, incidents]);

  
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
      data: [8, 12, 6, 15, 9, 5, 3] 
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
        alert('Relatório PDF gerado com sucesso!');
      } else if (format === 'pdf-complete') {
        console.log('Chamando generateCompletePDFReport...');
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
      console.error('Erro detalhado ao gerar relatório:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'Stack não disponível');
      alert(`Erro ao gerar relatório: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.`);
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

    
    pdf.setFontSize(20);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RELATÓRIO EXECUTIVO DE INFRAESTRUTURA', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, pageWidth / 2, yPosition, { align: 'center' });
    pdf.text(`Período: ${timeRange === '7d' ? 'Últimos 7 dias' : timeRange === '30d' ? 'Últimos 30 dias' : 'Período personalizado'}`, pageWidth / 2, yPosition + 5, { align: 'center' });

    yPosition += 20;

    
    pdf.setDrawColor(229, 231, 235);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;

    
    pdf.setFontSize(16);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RESUMO EXECUTIVO', 20, yPosition);
    yPosition += 10;

    
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

    
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    
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

    
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    
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

    
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`InfraWatch Report - Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Documento confidencial - Uso interno apenas', 20, pageHeight - 10);
    }

    
    const fileName = `infrawatch-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
    pdf.save(fileName);
  };

  const generateCompletePDFReport = async () => {
    console.log('Iniciando geração do PDF completo...');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    
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

    
    if (reportRef.current) {
      try {
        
        const chartElements = reportRef.current.querySelectorAll('.apexcharts-canvas');
        
        for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
          const chartElement = chartElements[i] as HTMLElement;
          if (chartElement) {
            yPosition += 10;
            
            
            pdf.setFontSize(14);
            pdf.setTextColor(31, 41, 55);
            const chartTitle = i === 0 ? 'Disponibilidade por Serviço' : i === 1 ? 'Conformidade SLA' : 'Tendência de Incidentes';
            pdf.text(chartTitle, 20, yPosition);
            yPosition += 10;
            
            
            const canvas = await html2canvas(chartElement, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - 40;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            
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

    
    pdf.addPage();
    yPosition = 20;

    
    pdf.setFontSize(18);
    pdf.setTextColor(31, 41, 55);
    pdf.text('RESUMO EXECUTIVO DETALHADO', 20, yPosition);
    yPosition += 15;

    
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

    
    pdf.addPage();
    yPosition = 20;

    
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

    
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`InfraWatch Executive Report - Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('© 2025 InfraWatch - Relatório Confidencial', 20, pageHeight - 10);
      pdf.text(`Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth - 60, pageHeight - 10);
    }

    
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
            Centro de Relatórios
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Análise detalhada de performance 
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          

          
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
        <MetricCard
          icon={<Shield className="w-8 h-8 text-green-600" />}
          title="DISPONIBILIDADE GERAL"
          value={`${overallMetrics.availability}%`}
          subtitle={`${overallMetrics.operationalServices} de ${overallMetrics.totalServices} serviços`}
          colorClass="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700"
        >
          <CheckCircle className="w-3 h-3 text-green-600" />
        </MetricCard>
        <MetricCard
          icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
          title="SLA MÉDIO GLOBAL"
          value={`${overallMetrics.averageSLA}%`}
          subtitle="Meta: 99.0%"
          colorClass="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700"
        >
          <Target className="w-3 h-3 text-blue-600" />
        </MetricCard>
        <MetricCard
          icon={<AlertTriangle className="w-8 h-8 text-yellow-600" />}
          title="INCIDENTES (30D)"
          value={overallMetrics.totalIncidents}
          subtitle={`${overallMetrics.criticalIncidents} críticos`}
          colorClass="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700"
        >
          <AlertTriangle className="w-3 h-3 text-red-600" />
        </MetricCard>
        <MetricCard
          icon={<Zap className="w-8 h-8 text-purple-600" />}
          title="MTTR MÉDIO"
          value={`${overallMetrics.averageMTTR}min`}
          subtitle={`${overallMetrics.totalDowntime}h downtime total`}
          colorClass="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700"
        >
          <Clock className="w-3 h-3 text-purple-600" />
        </MetricCard>
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
                  items={["Critical", "High", "Medium", "Low"].map((category) => ({
                    label: category,
                    value: services.filter(s => s.category === category).length,
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
                  items={["Aplicação", "Serviço", "Base de Dados", "Servidor Web", "Backup"].map((type) => {
                    const typeServices = services.filter(s => s.type === type);
                    return {
                      label: type,
                      value: typeServices.length,
                      total: services.length,
                    };
                  })}
                  unit="serviços"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

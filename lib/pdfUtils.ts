import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type Metric = { label: string; value: number | string };
export type Service = { name: string; status: string };
export type Incident = { id: number | string; title: string; date: string };
export type Analytics = { label: string; value: string };

export interface PDFReportData {
  metrics: Metric[];
  services: Service[];
  incidents: Incident[];
  analytics: Analytics[];
}

export async function generatePDFReport({
  metrics,
  services,
  incidents,
  analytics,
}: PDFReportData): Promise<void> {
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(18);
  doc.text('Relatório Executivo de Infraestrutura', 105, y, {
    align: 'center',
  });
  y += 10;

  // Métricas
  autoTable(doc, {
    head: [['Métrica', 'Valor']],
    body: metrics.map((m) => [m.label, String(m.value)]),
    startY: y,
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Serviços
  autoTable(doc, {
    head: [['Serviço', 'Status']],
    body: services.map((s) => [s.name, s.status]),
    startY: y,
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Incidentes
  autoTable(doc, {
    head: [['ID', 'Título', 'Data']],
    body: incidents.map((i) => [String(i.id), i.title, i.date]),
    startY: y,
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Analytics
  autoTable(doc, {
    head: [['Indicador', 'Valor']],
    body: analytics.map((a) => [a.label, a.value]),
    startY: y,
  });

  doc.save('relatorio.pdf');
}

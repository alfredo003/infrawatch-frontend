
export interface TransformedService {
  id: string;
  name: string;
  type: string;
  category: string;
  slaTarget: number;
  slaActual: number;
  availability: number;
  mttr: number;
  mtbf: number;
  incidents: number;
  downtime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  status: 'operational' | 'degraded' | 'outage';
  lastIncident: string;
}

export interface TransformedIncident {
  id: string;
  service: string;
  title: string;
  severity: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: number;
  impact: string;
  rootCause: string;
  assignee: string;
}

/**
 * Mapeia o nível de criticidade para a categoria do serviço
 */
const mapCriticalityToCategory = (criticality: string): string => {
  const mapping: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return mapping[criticality?.toLowerCase()] || 'Medium';
};

/**
 * Mapeia o status do sistema para o status do serviço
 */
const mapSystemStatus = (status: string): 'operational' | 'degraded' | 'outage' => {
  if (status === 'up') return 'operational';
  if (status === 'down') return 'outage';
  return 'degraded';
};

/**
 * Encontra o tipo do sistema pelo ID
 */
const getSystemTypeName = (typeId: string, systemTypes: any[]): string => {
  const type = systemTypes.find(t => t.id === typeId);
  return type?.name || 'Desconhecido';
};

/**
 * Extrai dados da estrutura da API (suporta múltiplos formatos)
 */
const extractApiData = (reportData: any) => {

  if (Array.isArray(reportData) && reportData.length > 0 && reportData[0].data) {
    console.log('✅ Formato detectado: Array com data');
    return reportData[0].data;
  }

  // Caso 2: Objeto direto com propriedade 'data'
  if (reportData && typeof reportData === 'object' && reportData.data) {
    console.log('✅ Formato detectado: Objeto com data');
    return reportData.data;
  }

  // Caso 3: Array com objetos diretos
  if (Array.isArray(reportData) && reportData.length > 0) {
    console.log('✅ Formato detectado: Array direto');
    return reportData[0];
  }

  // Caso 4: Objeto direto (já é o data)
  if (reportData && typeof reportData === 'object') {
    console.log('✅ Formato detectado: Objeto direto');
    return reportData;
  }

  console.error('❌ Formato de dados não reconhecido');
  return null;
};

/**
 * Transforma os dados da API em serviços
 */
export const transformServicesData = (reportData: any): TransformedService[] => {

  if (!reportData) {
    console.warn('⚠️ reportData é null ou undefined');
    return [];
  }

  const data = extractApiData(reportData);
  if (!data) {
    console.error('❌ Não foi possível extrair dados da API');
    return [];
  }

  const systems = data.systems || [];
  const metrics = data.metrics || [];
  const systemTypes = data.systemTypes || [];

  if (systems.length === 0) {
    console.warn('⚠️ Nenhum sistema encontrado nos dados');
    return [];
  }

  return systems.map((system: any) => {
  
    const systemMetric = metrics.find((m: any) => m.system_id === system.id);

    const slaActual = parseFloat(systemMetric?.sla_percent) || 0;
    const availability = parseFloat(systemMetric?.uptime_percent) || 0;
    const status = mapSystemStatus(system.status);
    const typeName = getSystemTypeName(system.id_type, systemTypes);

   
    const transformedService = {
      id: system.id,
      name: system.name,
      type: typeName,
      category: mapCriticalityToCategory(system.criticality_level),
      slaTarget: system.sla_target || 99.9,
      slaActual: slaActual,
      availability: availability,
      mttr: systemMetric?.downtime_minutes || 0,
      mtbf: 0,
      incidents: 0, 
      downtime: systemMetric?.downtime_minutes || 0,
      responseTime: systemMetric?.value?.latency || 0,
      throughput: 0,
      errorRate: systemMetric?.value?.packetLoss || 0,
      status: status,
      lastIncident: systemMetric?.last_check || '',
    };
    return transformedService;
  });
};

/**
 * Transforma os dados de incidentes
 */
export const transformIncidentsData = (reportData: any): TransformedIncident[] => {
  console.log('🚀 Iniciando transformação de incidentes...');
  
  if (!reportData) {
    console.warn('⚠️ reportData é null ou undefined');
    return [];
  }

  const data = extractApiData(reportData);
  
  if (!data) {
    console.error('❌ Não foi possível extrair dados da API para incidentes');
    return [];
  }

  const systems = data.systems || [];
  const metrics = data.metrics || [];

  // Cria incidentes baseados em sistemas com problemas
  const incidents: TransformedIncident[] = [];

  systems.forEach((system: any) => {
    const systemMetric = metrics.find((m: any) => m.system_id === system.id);
    
    if (system.status === 'down' || (systemMetric && systemMetric.downtime_minutes > 0)) {
      const severity = system.criticality_level === 'critical' ? 'Critical' :
                      system.criticality_level === 'high' ? 'High' :
                      system.criticality_level === 'medium' ? 'Medium' : 'Low';

      incidents.push({
        id: `INC-${system.id.substring(0, 8)}`,
        service: system.name,
        title: `${system.status === 'down' ? 'Sistema Offline' : 'Degradação de Performance'} - ${system.name}`,
        severity: severity,
        status: system.status === 'down' ? 'open' : 'resolved',
        startTime: systemMetric?.last_check || new Date().toISOString(),
        endTime: system.status === 'up' ? systemMetric?.last_check || '' : '',
        duration: systemMetric?.downtime_minutes || 0,
        impact: `Sistema ${system.name} ${system.status === 'down' ? 'está indisponível' : 'apresentou degradação'}`,
        rootCause: system.status === 'down' ? 'Conexão perdida' : 'Performance degradada',
        assignee: system.owner_user_id || 'Não atribuído',
      });
    }
  });

  console.log('📊 Incidentes criados:', incidents.length);
  return incidents;
};


export const calculateOverallMetrics = (
  services: TransformedService[],
  incidents: TransformedIncident[]
) => {
  console.log('📊 Calculando métricas gerais...');
  
  const totalServices = services.length;
  const operationalServices = services.filter(s => s.status === 'operational').length;
  const averageSLA = totalServices > 0
    ? services.reduce((sum, s) => sum + s.slaActual, 0) / totalServices
    : 0;
  const totalIncidents = incidents.length;
  const criticalIncidents = incidents.filter(i => i.severity === 'Critical').length;
  const averageMTTR = totalServices > 0
    ? services.reduce((sum, s) => sum + s.mttr, 0) / totalServices
    : 0;
  const totalDowntime = services.reduce((sum, s) => sum + s.downtime, 0);
  const availability = totalServices > 0
    ? (operationalServices / totalServices) * 100
    : 0;

  const metrics = {
    totalServices,
    operationalServices,
    averageSLA: Number(averageSLA.toFixed(2)),
    totalIncidents,
    criticalIncidents,
    averageMTTR: Number(averageMTTR.toFixed(1)),
    totalDowntime: Number((totalDowntime / 60).toFixed(1)),
    availability: Number(availability.toFixed(1)),
  };

  return metrics;
};
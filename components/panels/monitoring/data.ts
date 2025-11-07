import {
  Activity,
  AlertCircle,
  Clock,
  Cpu,
  HardDrive,
  Network,
  Server,
  Webhook,
} from 'lucide-react';

export const connectionTypes = [
  {
    type: 'ping',
    label: 'Ping',
    icon: Clock,
    metrics: [
      {
        label: 'Latência',
        key: 'latency',
        unit: 'ms',
        description: 'Tempo de resposta da rede em milissegundos',
        icon: Clock,
      },
      {
        label: 'Perda de Pacotes',
        key: 'packetLoss',
        unit: '%',
        description: 'Porcentagem de pacotes perdidos durante a comunicação',
        icon: AlertCircle,
      },
    ],
  },
  {
    type: 'snmp',
    label: 'SNMP',
    icon: Network,
    metrics: [
      {
        label: 'CPU',
        key: 'cpu',
        unit: '%',
        description: 'Uso percentual da CPU do equipamento',
        icon: Cpu,
      },
      {
        label: 'Memória',
        key: 'memory',
        unit: '%',
        description: 'Uso percentual da memória RAM',
        icon: Activity,
      },
      {
        label: 'Disco',
        key: 'storage',
        unit: '%',
        description: 'Uso percentual do armazenamento',
        icon: HardDrive,
      },
    ],
  },
  {
    type: 'api',
    label: 'API',
    icon: Server,
    metrics: [
      {
        label: 'Tempo de Resposta',
        key: 'apiResponseTime',
        unit: 'ms',
        description: 'Tempo médio de resposta das requisições API',
        icon: Clock,
      },
      {
        label: 'Usuários Ativos',
        key: 'activeUsers',
        unit: '',
        description: 'Número de usuários ativos na aplicação',
        icon: Activity,
      },
    ],
  },
  {
    type: 'webhook',
    label: 'Webhook',
    icon: Webhook,
    metrics: [
      {
        label: 'Eventos Recebidos',
        key: 'webhookEvents',
        unit: '',
        description: 'Quantidade de eventos recebidos via webhook',
        icon: Webhook,
      },
    ],
  },
];

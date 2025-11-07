import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Globe, Server } from 'lucide-react';
import { ReactNode } from 'react';

interface ServiceCardProps {
  name: string;
  type: string;
  category: string;
  status: string;
  availability: number;
  slaTarget: number;
  slaActual: number;
  mttr: number;
  incidents: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  getCategoryColor: (category: string) => string;
  getStatusColor: (status: string) => string;
}

export function ServiceCard({
  name,
  type,
  category,
  status,
  availability,
  slaTarget,
  slaActual,
  mttr,
  incidents,
  responseTime,
  throughput,
  errorRate,
  getCategoryColor,
  getStatusColor,
}: ServiceCardProps) {
  return (
    <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            {type === 'Base de Dados' ? (
              <Database className="w-5 h-5 text-blue-600" />
            ) : type === 'Servidor Web' ? (
              <Globe className="w-5 h-5 text-blue-600" />
            ) : (
              <Server className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getCategoryColor(category)} variant="secondary">
                {category}
              </Badge>
              <Badge className={getStatusColor(status)} variant="secondary">
                {status === 'operational'
                  ? 'Operacional'
                  : status === 'degraded'
                    ? 'Degradado'
                    : 'Indisponível'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            {availability}%
          </p>
          <p className="text-sm text-neutral-500">Disponibilidade</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div>
          <p className="text-xs text-neutral-500 uppercase">SLA Target</p>
          <p className="font-medium">{slaTarget}%</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase">SLA Atual</p>
          <p
            className={`font-medium ${slaActual >= slaTarget ? 'text-green-600' : 'text-red-600'}`}
          >
            {slaActual}%
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase">MTTR</p>
          <p className="font-medium">{mttr}min</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase">Incidentes</p>
          <p className="font-medium">{incidents}</p>
        </div>
      </div>
      <div className="relative">
        <Progress value={availability} className="h-3" />
        <div
          className="absolute top-0 h-3 w-0.5 bg-red-500 z-10"
          style={{ left: `${slaTarget}%` }}
          title={`Meta SLA: ${slaTarget}%`}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
        <div>
          <p className="text-xs text-neutral-500">Tempo Resposta</p>
          <p className="text-sm font-medium">{responseTime}ms</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Throughput</p>
          <p className="text-sm font-medium">{throughput}/min</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Taxa de Erro</p>
          <p className="text-sm font-medium">{errorRate}%</p>
        </div>
      </div>
    </div>
  );
}

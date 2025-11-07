import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

interface IncidentCardProps {
  id: string;
  title: string;
  service: string;
  severity: string;
  status: string;
  duration: number;
  impact: string;
  assignee: string;
  startTime: string;
  rootCause: string;
  getSeverityColor: (severity: string) => string;
  formatDuration: (duration: number) => string;
}

export function IncidentCard({
  id,
  title,
  service,
  severity,
  status,
  duration,
  impact,
  assignee,
  startTime,
  rootCause,
  getSeverityColor,
  formatDuration,
}: IncidentCardProps) {
  return (
    <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
              {title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {id} • {service}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getSeverityColor(severity)} variant="secondary">
            {severity}
          </Badge>
          <Badge
            className="text-green-600 bg-green-100 dark:bg-green-900/20"
            variant="secondary"
          >
            {status}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div>
          <p className="text-xs text-neutral-500 uppercase">Duração</p>
          <p className="font-medium">{formatDuration(duration)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase">Impacto</p>
          <p className="font-medium">{impact}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase">Responsável</p>
          <p className="font-medium">{assignee}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 uppercase">Início</p>
          <p className="font-medium">
            {new Date(startTime).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Causa Raiz:
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {rootCause}
        </p>
      </div>
    </div>
  );
}

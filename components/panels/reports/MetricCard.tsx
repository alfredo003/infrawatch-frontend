import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  colorClass?: string;
  children?: ReactNode;
}

export function MetricCard({
  icon,
  title,
  value,
  subtitle,
  colorClass = '',
  children,
}: MetricCardProps) {
  return (
    <Card className={colorClass}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && (
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xs">{subtitle}</p>
              </div>
            )}
            {children}
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

import { Progress } from "@/components/ui/progress";
import { ReactNode } from "react";

interface AnalyticsCardProps {
  title: string;
  items: Array<{ label: string; value: number; total: number; }>;
  unit?: string;
}

export function AnalyticsCard({ title, items, unit = "serviços" }: AnalyticsCardProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      {items.map(({ label, value, total }) => {
        const percentage = (value / total) * 100;
        return (
          <div key={label} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-sm text-neutral-500">{value} {unit}</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}
    </div>
  );
}

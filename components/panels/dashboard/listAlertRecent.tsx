import { CardContent } from "@/components/ui/card";
import { getSeverityColor } from "@/lib/utils";
import { AlertData } from "@/services/alertService";
import { Badge } from "lucide-react";
import { KeyedMutator } from "swr";

interface ListProps {
    alerts: AlertData[] | undefined;
    loading?: boolean;
    onSystemReload: KeyedMutator<AlertData[]>; 
}

export default function ListAlertRecent({ alerts, loading = false, onSystemReload }: ListProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className="border-l-4 border-l-red-500 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
                    {alert.system}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {alert.message}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {alert.time}
                  </p>
                </div>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity === "critical"
                    ? "Crítico"
                    : alert.severity === "warning"
                      ? "Aviso"
                      : "Info"}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-neutral-600 dark:text-neutral-400">Não existe nenhum alerta recente.</p>
        )}
      </div>
    </CardContent>
  );
}

import { CardContent } from "@/components/ui/card";
import { AlertData } from "@/services/alertService";
import { Mail } from "lucide-react";
import { KeyedMutator } from "swr";
import Link from "next/link";

interface ListProps {
  alerts: AlertData[] | undefined;
  loading?: boolean;
  onSystemReload: KeyedMutator<AlertData[]>;
}

export default function ListAlertRecent({ alerts, loading = false, onSystemReload }: ListProps) {
  const maxAlerts = 6;
  const visibleAlerts = alerts ? alerts.slice(0, maxAlerts) : [];

  return (
    <CardContent>
      <div className="space-y-4">
        {alerts && alerts.length > 0 ? (
          <>
            {visibleAlerts.map((alert) => (
              <div key={alert.id} className="border-l-4 border-l-red-500 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
                      {alert.trigger_condition}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {alert.recipient}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">{alert.sent_at}</p>
                  </div>
                  <Mail />
                </div>
              </div>
            ))}

            {alerts.length > maxAlerts && (
              <div className="text-center">
                <Link
                  href="/alerts"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Ver mais
                </Link>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            Não existe nenhum alerta recente.
          </p>
        )}
      </div>
    </CardContent>
  );
}

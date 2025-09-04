import { CardContent } from "@/components/ui/card";
import { dateConversion, getStatusColor } from "@/lib/utils";
import { SystemData } from "@/services/systemService";
import { Globe, HardDrive, Link, Router, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KeyedMutator } from "swr";

interface ListProps {
  Systems: SystemData[] | undefined;
  loading?: boolean;
  onSystemReload: KeyedMutator<SystemData[]>;
}

const getImgByTypeConexao = (type: string) => {
  switch (type) {
    case "api":
      return (
        <Globe className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      );
    case "snmp":
      return (
        <HardDrive className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      );
    case "ping":
      return (
        <Router className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      );
    case "webhook":
      return (
        <Link className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      );
    default:
      return (
        <Globe className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
      );
  }
};

export default function ListSystems({
  Systems,
  loading = false,
  onSystemReload,
}: ListProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        {Systems?.map((system, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getImgByTypeConexao(system.connection_type)}
              <div>
                <h3 className="font-medium text-neutral-800 dark:text-neutral-200">
                  {system.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {system.connection_type}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {system.sla_target}%
                </p>
                <p className="text-xs text-neutral-500">Uptime</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {dateConversion(system.updated_at)}
                </p>
                <p className="text-xs text-neutral-500">Última verificação</p>
              </div>
              <Badge className={getStatusColor(system.status)}>
                {system.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}

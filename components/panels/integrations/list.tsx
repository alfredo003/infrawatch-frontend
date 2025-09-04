import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Integration } from "@/services/integrationService";
import { Edit, Trash2, Unplug } from "lucide-react";
import { useState } from "react";
import { KeyedMutator } from "swr";
import {
  CONNECTION_TYPES,
  INTEGRATION_TYPES,
  STATUS_OPTIONS,
} from "./register";

interface ListProps {
  integrations: Integration[] | undefined;
  loading?: boolean;
  onSystemReload: KeyedMutator<Integration[]>;
}

export default function ListIntegrations({
  integrations,
  loading,
  onSystemReload,
}: ListProps) {
  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusOption?.color || "gray";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations?.map((system) => {
        const systemType = INTEGRATION_TYPES.find(
          (type) => type.value === system.id_type,
        );
        const connectionType = CONNECTION_TYPES.find(
          (type) => type.value === system.connection_type,
        );
        const statusColor = getStatusColor(system.status);

        return (
          <Card key={system.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Unplug className="w-6 h-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{system.name}</CardTitle>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {systemType?.label || system.id_type}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    statusColor === "green"
                      ? "border-green-500 text-green-600"
                      : statusColor === "red"
                        ? "border-red-500 text-red-600"
                        : statusColor === "yellow"
                          ? "border-yellow-500 text-yellow-600"
                          : statusColor === "orange"
                            ? "border-orange-500 text-orange-600"
                            : "border-gray-500 text-gray-600"
                  }`}
                >
                  {STATUS_OPTIONS.find((opt) => opt.value === system.status)
                    ?.label || system.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Conexão:
                  </span>
                  <p className="font-medium">
                    {connectionType?.label || system.connection_type}
                  </p>
                </div>
                {/* <div>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Criticidade:
                      </span>
                      <p className="font-medium">
                        Nível {system.criticality_level}
                        {system.criticality_level === 5 && " 🔴"}
                        {system.criticality_level === 4 && " 🟠"}
                        {system.criticality_level === 3 && " 🟡"}
                        {system.criticality_level <= 2 && " 🟢"}
                      </p>
                    </div> */}
              </div>

              <div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                  Target:
                </span>
                <p className="text-sm font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded mt-1 truncate">
                  {system.target}
                </p>
              </div>

              {/* <div className="text-xs text-neutral-500">
                    <p>Intervalo: {system.check_interval}s</p>
                    <p>Responsável: {system.owner_user_id || "Não definido"}</p>
                  </div> */}

              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-xs text-neutral-500">
                  Criada em:{" "}
                  {new Date(system.createdAt).toLocaleDateString("pt-BR")}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(system)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(system.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

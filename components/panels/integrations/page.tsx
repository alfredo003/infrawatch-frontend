"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Unplug,
  Library,
  Workflow,
  PackageCheck,
  BrainCircuit,
  AlertTriangle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ListIntegrations from "./list";
import { Integration, listAllIntegration } from "@/services/integrationService";
import useSWR from "swr";
import RegisterIntegration, { STATUS_OPTIONS } from "./register";

export default function IntegrationPage() {
  const [isSystemCreateDialogOpen, setIsSystemCreateDialogOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    id_type: "",
    connection_type: "",
    status: "funcionando",
    criticality_level: 3,
    check_interval: 60,
    owner_user_id: "",
    target: "https://infrawatch-integration.com/",
    company_id: "",
  });

  const { toast } = useToast();

  const {
    data: integrations,
    error: systemsError,
    isLoading: systemsLoading,
    mutate: reloadSystems,
  } = useSWR<Integration[]>("integrations", listAllIntegration, {
    dedupingInterval: 60000,
    revalidateOnFocus: false,
  });

  if (systemsError) return <div>Erro ao carregar dados</div>;
  if (systemsLoading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              INTEGRAÇÕES
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Gerencie as integrações disponíveis
            </p>
          </div>

          <Button
            onClick={() => setIsSystemCreateDialogOpen(true)}
            className="bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Faer Integração
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Integrações realizadas
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {integrations?.length}
                  </p>
                </div>
                <Workflow className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Tipos disponíveis
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {
                      integrations.filter((s) => s.criticality_level === 5)
                        .length
                    }
                  </p>
                </div>
                <Library className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Operacionais
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      integrations.filter((s) => s.status === "operacionais")
                        .length
                    }
                  </p>
                </div>
                <PackageCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Com Problemas
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {
                      integrations.filter(
                        (s) => s.status === "down" || s.status === "alerta",
                      ).length
                    }
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <ListIntegrations
          integrations={integrations}
          loading={systemsLoading}
          onSystemReload={reloadSystems}
        />

        {integrations?.length === 0 && (
          <div className="text-center py-12">
            <BrainCircuit className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              Nenhuma integração feita
            </h3>
            <p className="text-neutral-500 mb-4">
              Comece por cadastrar sua primeira integração
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Integração
            </Button>
          </div>
        )}
      </div>

      {/* Criar Novo RegisterIntegration */}
      <Dialog
        open={isSystemCreateDialogOpen}
        onOpenChange={setIsSystemCreateDialogOpen}
      >
        <RegisterIntegration
          setIsSystemCreateDialogOpen={setIsSystemCreateDialogOpen}
          onSystemCreated={reloadSystems}
        />
      </Dialog>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Integration, handleDeleteIntegration } from "@/services/integrationService";
import { Bot, Ticket, Trash2, View } from "lucide-react";
import { KeyedMutator } from "swr";
import { useState } from "react"; 

export const INTEGRATION_TYPES = [
  { value: "1", label: "AGENT" },
  { value: "2", label: "GLPI" },
];

interface ListProps {
  integrations: Integration[] | undefined;
  loading?: boolean
}

export default function ListIntegrations({ integrations, loading }: ListProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<Integration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-green-500 text-green-600";
      case "desative":
        return "border-red-500 text-red-600";
      default:
        return "border-gray-500 text-gray-600";
    }
  };

  const openViewModal = (system: Integration) => {
    setSelectedSystem(system);
    setViewModalOpen(true);
  };

  const openDeleteModal = (system: Integration) => {
    setSelectedSystem(system);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSystem) return;

    setIsLoading(true);
    try {
      await handleDeleteIntegration(String(selectedSystem.id), setIsLoading, setError);
      toast({
        title: "Sucesso!",
        description: "Integração deletada com sucesso",
      });
      setDeleteModalOpen(false);  
    } catch (err) {
      setError("Falha ao deletar integração");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations?.map((system) => {
          const integrationType = INTEGRATION_TYPES.find(
            (type) => type.value === system.type
          );

          return (
            <Card key={system.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {system.type === "AGENT" ? (
                      <Bot className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Ticket className="w-6 h-6 text-yellow-600" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{system.cod_agent}</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {system.type  || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(system.status)}`}>
                    {system.status === "active" ? "Conectado" : "Desativado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    TOKEN:
                  </span>
                  <p className="text-sm font-mono bg-neutral-100 dark:bg-neutral-800 p-2 rounded mt-1 truncate">
                    {system.token || "N/A"}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-xs text-neutral-500">
                    Criada em: {new Date(system.date_time).toLocaleDateString("pt-BR")}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openViewModal(system)}
                    >
                      <View className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDeleteModal(system)}
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

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="bg-card border-border max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-semibold">
              Visualizar Integração
            </DialogTitle>
          </DialogHeader>
          <hr />
          <br />
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">
                Código do Agente
              </Label>
              <Input
                value={selectedSystem?.cod_agent || ""}
                readOnly
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">
                Tipo de Integração
              </Label>
              <Input
                value={INTEGRATION_TYPES.find((type) => type.value === selectedSystem?.type)?.label || "Unknown"}
                readOnly
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">
                Status
              </Label>
              <Input
                value={selectedSystem?.status === "active" ? "Conectado" : "Desativado"}
                readOnly
                className="bg-background border-border text-foreground"
              />
            </div>
            {selectedSystem?.type === "1" && (
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium uppercase tracking-wide">
                  Token do Agente
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={selectedSystem?.token || "N/A"}
                    readOnly
                    className="bg-background border-border text-foreground"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedSystem?.token || "").then(() => {
                        toast({
                          title: "Sucesso!",
                          description: "Token copiado para a área de transferência",
                        });
                      }).catch(() => {
                        toast({
                          title: "Erro",
                          description: "Falha ao copiar o token",
                          variant: "destructive",
                        });
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-600/90 text-primary-foreground"
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            )}
            {selectedSystem?.type === "2" && (
              <>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm font-medium uppercase tracking-wide">
                    API Token
                  </Label>
                  <Input
                    value={selectedSystem?.api_token || "N/A"}
                    readOnly
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm font-medium uppercase tracking-wide">
                    API URL
                  </Label>
                  <Input
                    value={selectedSystem?.api_url || "N/A"}
                    readOnly
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-sm font-medium uppercase tracking-wide">
                    Auth Token
                  </Label>
                  <Input
                    value={selectedSystem?.auth_token || "N/A"}
                    readOnly
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setViewModalOpen(false)}
              className="border-border text-foreground hover:bg-muted transition-colors"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-card border-border max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-semibold">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-neutral-600 dark:text-neutral-400">
              Tem certeza que deseja excluir a integração "{selectedSystem?.cod_agent}"? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-primary-foreground transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
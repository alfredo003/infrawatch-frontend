"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { deleteSystem, SystemData } from "@/services/systemService";
import {
  Edit,
  Eye,
  Globe,
  HardDrive,
  Link,
  Router,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { KeyedMutator } from "swr";

interface ListProps {
  paginatedSystems: SystemData[];
  loading?: boolean;
  onSystemReload: KeyedMutator<SystemData[]>; // ✅ mutate é passado aqui
}

export default function ListSystems({
  paginatedSystems,
  loading = false,
  onSystemReload,
}: ListProps) {
  const [systemDeleteDialogOpen, setSystemDeleteDialogOpen] = useState(false);
  const [viewingSystem, setViewingSystem] = useState<SystemData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSystemAction = (action: string, systemId: string | undefined) => {
    const system = paginatedSystems.find((u) => u.id === systemId);

    if (action === "delete" && system) {
      setViewingSystem(system);
      setSystemDeleteDialogOpen(true);
    }
    if (action === "view" && system) {
      // aqui podes abrir o modal de detalhes
    }
    if (action === "edit" && system) {
      // aqui podes abrir o modal de edição
    }
  };

  const handleDelete = async (data: SystemData | null) => {
    if (!data) return;
    try {
      setIsLoading(true);
      await deleteSystem(data.id, setIsLoading);

      toast({
        title: `${data.name} Eliminado!`,
        description: "Sistema eliminado com sucesso",
      });

      setSystemDeleteDialogOpen(false);
      await onSystemReload();  
    } catch (err) {
      toast({
        title: "Erro ao eliminar",
        description: "Não foi possível eliminar o sistema",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLevel = (role: string) => {
    switch (role) {
      case "low":
        return <span className="text-sm bg-green-600 px-2 text-white">Baixo</span>;
      case "medium":
        return <span className="text-sm bg-yellow-600 px-2 text-white">Médio</span>;
      case "high":
        return <span className="text-sm bg-gray-600 px-2 text-white">Alto</span>;
      default:
        return <span className="text-sm bg-red-600 px-2 text-white">Crítico</span>;
    }
  };

  const getImgByTypeConexao = (type: string) => {
    switch (type) {
      case "api":
        return <Globe className="w-4 h-4 text-gray-600" />;
      case "snmp":
        return <HardDrive className="w-4 h-4 text-gray-600" />;
      case "ping":
        return <Router className="w-4 h-4 text-gray-600" />;
      case "webhook":
        return <Link className="w-4 h-4 text-gray-600" />;
      default:
        return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div>
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">NOME</th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">TIPO</th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">CONEXÃO</th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">NÍVEL</th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">Alvo</th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">CHECK (s)</th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center p-4 text-muted-foreground">
                Carregando...
              </td>
            </tr>
          ) : (
            paginatedSystems.map((system: SystemData) => (
              <tr
                key={system.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-4 px-2 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 flex items-center justify-center">
                    {getImgByTypeConexao(system.connection_type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{system.name}</p>
                    <p className="text-xs text-muted-foreground">{system.status}</p>
                  </div>
                </td>
                <td className="py-4 px-2">{system.typeName}</td>
                <td className="py-4 px-2">{system.connection_type.toUpperCase()}</td>
                <td className="py-4 px-2">{getLevel(system.criticality_level)}</td>
                <td className="py-4 px-2 uppercase">{system.target}</td>
                <td className="py-4 px-2">{system.check_interval}</td>
                <td className="py-4 px-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSystemAction("view", system.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSystemAction("edit", system.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSystemAction("delete", system.id)}
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Delete Dialog */}
      <Dialog open={systemDeleteDialogOpen} onOpenChange={setSystemDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar - {viewingSystem?.name}</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja eliminar permanentemente o{" "}
              <b>{viewingSystem?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSystemDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(viewingSystem)}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

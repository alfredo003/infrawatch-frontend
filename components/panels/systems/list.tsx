'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { getSeverityColor, getSeverityLabel } from '@/lib/utils';
import { deleteSystem, SystemData } from '@/services/systemService';
import {
  Edit,
  Eye,
  Globe,
  HardDrive,
  Link,
  Router,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { KeyedMutator } from 'swr';

interface ListProps {
  paginatedSystems: SystemData[];
  loading?: boolean;
  onSystemReload: KeyedMutator<SystemData[]>;
}

export default function ListSystems({
  paginatedSystems,
  loading = false,
  onSystemReload,
}: ListProps) {
  const [systemDeleteDialogOpen, setSystemDeleteDialogOpen] = useState(false);
  const [systemViewDialogOpen, setSystemViewDialogOpen] = useState(false);
  const [systemEditDialogOpen, setSystemEditDialogOpen] = useState(false);

  const [viewingSystem, setViewingSystem] = useState<SystemData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSystemAction = (action: string, systemId: string | undefined) => {
    const system = paginatedSystems.find((u) => u.id === systemId);

    if (action === 'delete' && system) {
      setViewingSystem(system);
      setSystemDeleteDialogOpen(true);
    }
    if (action === 'view' && system) {
      setViewingSystem(system);
      setSystemViewDialogOpen(true);
    }
    if (action === 'edit' && system) {
      setViewingSystem(system);
      setSystemEditDialogOpen(true);
    }
  };

  const handleDelete = async (data: SystemData | null) => {
    if (!data) return;
    try {
      setIsLoading(true);
      await deleteSystem(data.id, setIsLoading);

      toast({
        title: `${data.name} Eliminado!`,
        description: 'Sistema eliminado com sucesso',
      });

      setSystemDeleteDialogOpen(false);
      await onSystemReload();
    } catch (err) {
      toast({
        title: 'Erro ao eliminar',
        description: 'Não foi possível eliminar o sistema',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getImgByTypeConexao = (type: string) => {
    switch (type) {
      case 'api':
        return <Globe className="w-4 h-4 text-gray-600" />;
      case 'snmp':
        return <HardDrive className="w-4 h-4 text-gray-600" />;
      case 'ping':
        return <Router className="w-4 h-4 text-gray-600" />;
      case 'webhook':
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
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">
              NOME
            </th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">
              TIPO
            </th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">
              CONEXÃO
            </th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">
              NÍVEL
            </th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">
              Alvo
            </th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">
              CHECK (s)
            </th>
            <th className="text-left py-3 px-2 text-xs uppercase tracking-wider">
              AÇÕES
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center p-4 text-muted-foreground">
                Carregando...
              </td>
            </tr>
          ) : paginatedSystems.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4 text-muted-foreground">
                Não existe nenhum sistema
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
                    <p className="text-xs text-muted-foreground">
                      {system.status}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-2">{system.typeName}</td>
                <td className="py-4 px-2">
                  {system.connection_type.toUpperCase()}
                </td>
                <td
                  className={`py-4 px-2 text-center font-semibold ${getSeverityColor(system.criticality_level)}`}
                >
                  {getSeverityLabel(system.criticality_level)}
                </td>
                <td className="py-4 px-2 uppercase">
                  <code
                    className={`px-2 py-1 text-xs rounded-md text-white bg-black`}
                  >
                    {system.target}
                  </code>
                </td>
                <td className="py-4 px-2">{system.check_interval}</td>
                <td className="py-4 px-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSystemAction('view', system.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSystemAction('edit', system.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSystemAction('delete', system.id)}
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
      <Dialog
        open={systemDeleteDialogOpen}
        onOpenChange={setSystemDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar - {viewingSystem?.name}</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja eliminar permanentemente o{' '}
              <b>{viewingSystem?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSystemDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(viewingSystem)}
              disabled={isLoading}
            >
              {isLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={systemViewDialogOpen}
        onOpenChange={setSystemViewDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visualizar Sistema</DialogTitle>
            <DialogDescription>
              Detalhes do sistema selecionado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <b>Nome:</b> {viewingSystem?.name}
            </p>
            <p>
              <b>Tipo:</b> {viewingSystem?.typeName}
            </p>
            <p>
              <b>Conexão:</b> {viewingSystem?.connection_type}
            </p>
            <p>
              <b>Nível:</b>{' '}
              {getSeverityLabel(viewingSystem?.criticality_level || '')}
            </p>
            <p>
              <b>Alvo:</b> {viewingSystem?.target}
            </p>
            <p>
              <b>Intervalo:</b> {viewingSystem?.check_interval}s
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSystemViewDialogOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={systemEditDialogOpen}
        onOpenChange={setSystemEditDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sistema</DialogTitle>
            <DialogDescription>
              Altere os dados e salve as mudanças
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3">
            <div>
              <Label>Nome</Label>
              <Input defaultValue={viewingSystem?.name} />
            </div>
            <div>
              <Label>Alvo</Label>
              <Input defaultValue={viewingSystem?.target} />
            </div>
            <div>
              <Label>Intervalo</Label>
              <Input
                type="number"
                defaultValue={viewingSystem?.check_interval}
              />
            </div>
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSystemEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { handleCreateSystem } from '@/services/systemService';
import { useEffect, useState } from 'react';
import { z } from 'zod';

export interface TypeSystem {
  id: string;
  name: string;
}

interface RegisterModelProps {
  setIsSystemCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  typeSystems: any[] | undefined;
  onSystemCreated?: () => void;
}

const ConnectionType = z.enum(['api', 'snmp', 'ping', 'webhook']);
const Status = z.enum(['up', 'maintenance', 'down']);
const ipRegex =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
const urlRegex =
  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

const SystemSchema = z.object({
  name: z.string().min(1, 'Nome não pode ser vazio'),
  id_type: z.string().min(1, 'Tipo de sistema não pode ser vazio'),
  target: z
    .string()
    .min(1, 'Alvo não pode ser vazio')
    .refine((val) => ipRegex.test(val) || urlRegex.test(val), {
      message: 'Alvo deve ser um IP ou URL válido',
    }),
  connection_type: ConnectionType,
  status: Status,
  criticality_level: z.string().min(1, 'O nível crítico não pode ser vazio'),
  sla_target: z
    .number()
    .min(0, 'SLA deve ser >= 0')
    .max(100, 'SLA deve ser <= 100'),
  check_interval: z.number().refine((n) => Number.isInteger(n) && n > 0, {
    message: 'Intervalo deve ser um número inteiro positivo (segundos)',
  }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const initialFormState = {
  name: '',
  id_type: '',
  target: '',
  connection_type: 'ping',
  status: 'up',
  criticality_level: 'low',
  sla_target: 100,
  check_interval: 60,
  updated_at: '',
  lat: undefined as number | undefined,
  lng: undefined as number | undefined,
};

export default function RegisterSystem({
  setIsSystemCreateDialogOpen,
  typeSystems,
  onSystemCreated,
}: RegisterModelProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newSystemForm, setNewSystemForm] = useState(initialFormState);

  // Captura a localização do user
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setNewSystemForm((prev) => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
        },
        (err) => console.warn('Erro ao pegar localização:', err),
        { enableHighAccuracy: true },
      );
    }
  }, []);

  const handleChange = (
    field: keyof typeof initialFormState,
    value: string | number,
  ) => {
    setNewSystemForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const validation = SystemSchema.safeParse(newSystemForm);

    if (!validation.success) {
      setError(validation.error.errors.map((err) => err.message).join(', '));
      return;
    }

    setError(null);
    try {
      await handleCreateSystem(newSystemForm, setIsLoading, setError);
      toast({
        title: 'Sucesso!',
        description: 'Sistema Registrado com sucesso',
      });
      setNewSystemForm(initialFormState);
      setIsSystemCreateDialogOpen(false);
      onSystemCreated?.();
    } catch (err) {
      setError('Falha ao cadastrar sistema');
    }
  };

  return (
    <DialogContent className="bg-card border-border max-w-2xl p-6">
      <DialogHeader>
        <DialogTitle className="text-foreground text-2xl font-semibold">
          Registrar Novo Sistema
        </DialogTitle>
      </DialogHeader>
      <hr className="my-4" />

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {/* Campos hidden */}
      <input type="hidden" name="lat" value={newSystemForm.lat ?? ''} />
      <input type="hidden" name="lng" value={newSystemForm.lng ?? ''} />

      {/* Identificação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input
            value={newSystemForm.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nome do recurso"
          />
        </div>
        <div className="space-y-2">
          <Label>Tipo de Sistema</Label>
          <Select
            value={newSystemForm.id_type}
            onValueChange={(value) => handleChange('id_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de sistema" />
            </SelectTrigger>
            <SelectContent>
              {typeSystems?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Configuração */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Alvo</Label>
          <Input
            value={newSystemForm.target}
            onChange={(e) => handleChange('target', e.target.value)}
            placeholder="127.0.0.1 ou https://exemplo.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Tipo de Conexão</Label>
          <Select
            value={newSystemForm.connection_type}
            onValueChange={(value) => handleChange('connection_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de conexão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="snmp">SNMP</SelectItem>
              <SelectItem value="ping">Ping</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={newSystemForm.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="up">Up</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="down">Down</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nível de Criticidade</Label>
          <Select
            value={newSystemForm.criticality_level}
            onValueChange={(value) => handleChange('criticality_level', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Crítico</SelectItem>
              <SelectItem value="high">Alto</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="low">Baixo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>SLA Target (%)</Label>
          <Input
            type="number"
            value={newSystemForm.sla_target}
            onChange={(e) => handleChange('sla_target', Number(e.target.value))}
            placeholder="Ex: 99.9"
          />
        </div>
        <div className="space-y-2">
          <Label>Intervalo de Verificação (segundos)</Label>
          <Input
            type="number"
            value={newSystemForm.check_interval}
            onChange={(e) =>
              handleChange('check_interval', Number(e.target.value))
            }
            placeholder="Ex: 60"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={() => setIsSystemCreateDialogOpen(false)}
        >
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar Sistema'}
        </Button>
      </div>
    </DialogContent>
  );
}

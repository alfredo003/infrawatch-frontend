import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
import { handleCreateSystem } from "@/services/systemService"
import { useRouter } from "next/navigation"
import toast, { Toaster } from 'react-hot-toast';

import { useState } from "react"
import { z } from "zod";

interface RegisterModelProps
{
    setIsSystemCreateDialogOpen:React.Dispatch<React.SetStateAction<boolean>>,
    typeSystems:any[]
}

const ConnectionType = z.enum(['api', 'snmp', 'ping', 'webhook']);
const Status = z.enum(['up', 'maintenance', 'down']);
const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

const SystemSchema = z.object({
  name: z.string().min(1, 'Nome não pode ser vazio'),
  id_type: z.string().min(1, 'Tipo de sistema não pode ser vazio'),
  target: z.string().min(1, 'Alvo não pode ser vazio').refine(val => ipRegex.test(val) || urlRegex.test(val), {
    message: 'Alvo deve ser um IP ou URL válido',
  }),
  connection_type: ConnectionType,
  status: Status,
  criticality_level: z.string().min(1, 'O nivel critoco não pode ser vazio'),
  sla_target: z.number().min(0, 'SLA deve ser >= 0').max(100, 'SLA deve ser <= 100'),
  check_interval: z.number().refine(n => Number.isInteger(n) && n > 0, {
    message: 'Intervalo de verificação deve ser um número inteiro positivo (segundos)',
  }),
});

export default function RegisterSystem({
    setIsSystemCreateDialogOpen,
    typeSystems
}:RegisterModelProps)
{
      const [error, setError] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const router = useRouter();

      const [newSystemForm, setNewSystemForm] = useState({
          name: "",
          id_type: "",
          target: "",
          connection_type: "ping",
          status: "up",
          criticality_level: "low",
          sla_target: 100,
          check_interval: 60
        });


    const handleSubmit = async () => {
        const validation = SystemSchema.safeParse(newSystemForm);

        if (!validation.success) {
            setError(validation.error.errors[0].message);
            return;
        }

        setError(null);
        try {
            await handleCreateSystem(newSystemForm, setIsLoading, setError, router);
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                        alt=""
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Emilia Gates
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Sure! 8:30pm works great!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            ));
            //setIsSystemCreateDialogOpen(false);
           // onSystemCreated?.(); // Notify parent to refresh the systems list
        } catch (err) {
            setError("Falha ao cadastrar sistema");
        }
    };

    return (
        <DialogContent className="bg-card border-border max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl font-semibold">Registrar Novo Sistema</DialogTitle>
        </DialogHeader>
        <hr />
        <br />
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Nome</Label>
            <Input
              value={newSystemForm.name}
              onChange={(e) => setNewSystemForm({ ...newSystemForm, name: e.target.value })}
              placeholder="Nome do recurso"
              className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Tipo de Sistema</Label>
            <Select
              value={newSystemForm.id_type}
              onValueChange={(value) =>
                setNewSystemForm({ ...newSystemForm, id_type: value })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
                <SelectValue placeholder="Selecione o tipo de conexão" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                { typeSystems.map((item:{id:string,name:string},index) => (
                  <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                )) }
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Alvo</Label>
            <Input
              value={newSystemForm.target}
              onChange={(e) => setNewSystemForm({ ...newSystemForm, target: e.target.value })}
              placeholder="Endereço do alvo (ex: 127.0.0.1)"
              className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Tipo de Conexão</Label>
            <Select
              value={newSystemForm.connection_type}
              onValueChange={(value) =>
                setNewSystemForm({ ...newSystemForm, connection_type: value })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
                <SelectValue placeholder="Selecione o tipo de conexão" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="snmp">SNMP</SelectItem>
                <SelectItem value="ping">Ping</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Status</Label>
            <Select
              value={newSystemForm.status}
              onValueChange={(value) => setNewSystemForm({ ...newSystemForm, status: value })}
            >
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="down">Down</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Nível de Criticidade</Label>
            <Select
              value={newSystemForm.criticality_level}
              onValueChange={(value) =>
                setNewSystemForm({ ...newSystemForm, criticality_level: value })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
                <SelectValue placeholder="Selecione o nível de criticidade" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">SLA Target (%)</Label>
            <Input
              type="number"
              value={newSystemForm.sla_target}
              onChange={(e) => setNewSystemForm({ ...newSystemForm, sla_target: Number(e.target.value) })}
              placeholder="SLA Target (ex: 99.9)"
              className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Intervalo de Verificação (min)</Label>
            <Input
              type="number"
              value={newSystemForm.check_interval}
              onChange={(e) => setNewSystemForm({ ...newSystemForm, check_interval: Number(e.target.value) })}
              placeholder="Intervalo de verificação (ex: 1)"
              className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setIsSystemCreateDialogOpen(false)}
            className="border-border text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-600/90 text-primary-foreground transition-colors"
          >
            Registrar Sistema
          </Button>
        </div>
      </DialogContent>
    )
}
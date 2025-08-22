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

interface System {
  id: string;
  name: string;
  id_type: string;
  connection_type: string;
  status: string;
  criticality_level: number;
  check_interval: number;
  owner_user_id: string;
  target: string;
  company_id: string;
  createdAt: string;
}

const INTEGRATION_TYPES = [
  { value: "GLPi", label: "GLpi" },
  { value: "DocWare", label: "DocWare" },
];

const CONNECTION_TYPES = [
  // { value: "ping", label: "Ping" },
  // { value: "api", label: "API REST" },
  // { value: "webhook", label: "Webhook" },
  // { value: "snmp", label: "SNMP" },
  // { value: "tcp", label: "TCP Socket" },
  { value: "http", label: "HTTP/HTTPS" },
  // { value: "ssh", label: "SSH" },
  // { value: "database", label: "Database Connection" },
];

const STATUS_OPTIONS = [
  { value: "operacional", label: "Operacional", color: "green" },
  { value: "manutencao", label: "Em Manutenção", color: "yellow" },
  { value: "down", label: "Fora do Ar", color: "red" },
  { value: "alerta", label: "Em Alerta", color: "orange" },
];

export default function IntegrationsPage() {
  const [integrations, setSystems] = useState<System[]>([
    {
      id: "1",
      name: "GLPi - Cluster3.PCs",
      id_type: "Ativos",
      connection_type: "http",
      status: "operacional",
      criticality_level: 5,
      check_interval: 60,
      owner_user_id: "user-123",
      target: "https://infrawatch_glpi/apirest.php/",
      company_id: "company-1",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Documentos - DocWare",
      id_type: "Docs",
      connection_type: "http",
      status: "operacional",
      criticality_level: 5,
      check_interval: 120,
      owner_user_id: "user-456",
      target: "https://intrawatch-docuware-server/DocuWare/Platform/",
      company_id: "company-1",
      createdAt: "2024-01-10",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<System | null>(null);
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

  const resetForm = () => {
    setFormData({
      name: "",
      id_type: "",
      connection_type: "",
      status: "funcionando",
      criticality_level: 3,
      check_interval: 60,
      owner_user_id: "",
      target: "",
      company_id: "",
    });
    setEditingSystem(null);
  };

  const openModal = (system?: System) => {
    if (system) {
      setEditingSystem(system);
      setFormData({
        name: system.name,
        id_type: system.id_type,
        connection_type: system.connection_type,
        status: system.status,
        criticality_level: system.criticality_level,
        check_interval: system.check_interval,
        owner_user_id: system.owner_user_id,
        target: system.target,
        company_id: system.company_id,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.id_type ||
      !formData.connection_type ||
      !formData.target
    ) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingSystem) {
      setSystems((prev) =>
        prev.map((system) =>
          system.id === editingSystem.id ? { ...system, ...formData } : system,
        ),
      );
      toast({
        title: "Integração atualizado",
        description: "O sistema foi atualizado com sucesso",
      });
    } else {
      const newSystem: System = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setSystems((prev) => [...prev, newSystem]);
      toast({
        title: "Integração cadastrado",
        description: "O novo sistema foi cadastrado com sucesso",
      });
    }

    closeModal();
  };

  const handleDelete = (systemId: string) => {
    if (confirm("Tem certeza que deseja excluir esta integração?")) {
      setSystems((prev) => prev.filter((system) => system.id !== systemId));
      toast({
        title: "Integração excluída",
        description: "A integração foi excluída com sucesso!",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusOption?.color || "gray";
  };

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

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Integração
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSystem ? "Editar Integração" : "Cadastrar Nova Integração"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Nome da Integração */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Integração *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ex: Ativos de TI / Documentos principais"
                  />
                </div>

                {/* Tipo da Integração */}
                <div className="space-y-2">
                  <Label>Tipo da Integração *</Label>
                  <Select
                    value={formData.id_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, id_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTEGRATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo de Conexão */}
                <div className="space-y-2">
                  <Label>Tipo de Conexão *</Label>
                  <Select
                    value={formData.connection_type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        connection_type: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de conexão" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONNECTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target */}
                <div className="space-y-2">
                  <Label htmlFor="target">Alvo/Endpoint *</Label>
                  <Input
                    id="target"
                    value={formData.target}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        target: e.target.value,
                      }))
                    }
                    placeholder="Ex: https://api.example.com ou 192.168.1.100"
                  />
                </div>

                {/* Status */}
                {/* <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                {/* Nível de Criticidade */}
                {/* <div className="space-y-2">
                  <Label htmlFor="criticality">
                    Nível de Criticidade (1-5)
                  </Label>
                  <Input
                    id="criticality"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.criticality_level}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        criticality_level: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div> */}

                {/* Intervalo de Checagem */}
                {/* <div className="space-y-2">
                  <Label htmlFor="interval">
                    Intervalo de Checagem (segundos)
                  </Label>
                  <Input
                    id="interval"
                    type="number"
                    min="30"
                    value={formData.check_interval}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        check_interval: parseInt(e.target.value) || 60,
                      }))
                    }
                  />
                </div> */}

                {/* Responsável */}
                {/* <div className="space-y-2">
                  <Label htmlFor="owner">ID do Responsável</Label>
                  <Input
                    id="owner"
                    value={formData.owner_user_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        owner_user_id: e.target.value,
                      }))
                    }
                    placeholder="UUID do usuário responsável"
                  />
                </div> */}

                {/* ID da Empresa */}
                {/* <div className="space-y-2">
                  <Label htmlFor="company">ID da Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        company_id: e.target.value,
                      }))
                    }
                    placeholder="ID da empresa proprietária"
                  />
                </div> */}

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {editingSystem ? "Atualizar" : "Cadastrar"}
                  </Button>
                  <Button
                    onClick={closeModal}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                    {integrations.length}
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
                    {integrations.filter((s) => s.criticality_level === 5).length}
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
                    {integrations.filter((s) => s.status === "operacionais").length}
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

        {/* Lista de Integrações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((system) => {
            const systemType = INTEGRATION_TYPES.find(
              (type) => type.value === system.id_type,
            );
            const connectionType = CONNECTION_TYPES.find(
              (type) => type.value === system.connection_type,
            );
            const statusColor = getStatusColor(system.status);

            return (
              <Card
                key={system.id}
                className="hover:shadow-lg transition-shadow"
              >
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

        {integrations.length === 0 && (
          <div className="text-center py-12">
            <BrainCircuit className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              Nenhuma integração feita
            </h3>
            <p className="text-neutral-500 mb-4">
              Comece por cadastrar sua primeira integração
            </p>
            <Button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Integração
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

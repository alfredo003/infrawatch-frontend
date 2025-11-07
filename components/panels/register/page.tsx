'use client';

import type React from 'react';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  Users,
  Shield,
  Activity,
  Clock,
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { get } from 'http';
import { getAuthHeaders } from '@/lib/auth';
import { set } from 'react-hook-form';
import InlineError from '@/components/ui/inline-error';
import InlineSuccess from '@/components/ui/inline-success';

export default function RegisterPage() {
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalOperators, setTotalOperators] = useState(0);
  const [totalViewers, setTotalViewers] = useState(0);
  const [openUsers, setOpenUsers] = useState(false);
  const [fullUsers, setFullUsers] = useState<any[]>([]);
  const [isLoadingFull, setIsLoadingFull] = useState(false);

  useEffect(() => {
    setIsLoadingRegister(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: getAuthHeaders(),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecentUsers(data.data || []);
        const totalUsers = data.data?.length || 0;
        const totalAdmins =
          data.data?.filter((user) => user.role === 'admin').length || 0;
        const totalOperators =
          data.data?.filter((user) => user.role === 'operator').length || 0;
        const totalViewers =
          data.data?.filter((user) => user.role === 'viewer').length || 0;

        setTotalUsers(totalUsers);
        setTotalAdmins(totalAdmins);
        setTotalOperators(totalOperators);
        setTotalViewers(totalViewers);
      })
      .finally(() => {
        setIsLoadingRegister(false);
      });
  }, []);

  // helper to fetch full users list
  const fetchFullUsers = async () => {
    setIsLoadingFull(true);
    try {
      const r = await fetch(`${API_URL}/users`, { headers: getAuthHeaders() });
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        throw new Error(`Status ${r.status} ${r.statusText} ${txt}`);
      }
      const data = await r.json();
      setFullUsers(data.data || []);
    } catch (err) {
      console.error('Failed to load full users list', err);
    } finally {
      setIsLoadingFull(false);
    }
  };

  // Fetch when modal opens
  useEffect(() => {
    if (openUsers) fetchFullUsers();
  }, [openUsers]);

  // dialog controls: search/filter/export
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filteredUsers = fullUsers.filter((u: any) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q || `${u.username} ${u.email}`.toLowerCase().includes(q);
    return matchesRole && matchesQuery;
  });

  const handleExportCSV = () => {
    const rows = [['id', 'username', 'email', 'role']];
    fullUsers.forEach((u) =>
      rows.push([u.id ?? '', u.username ?? '', u.email ?? '', u.role ?? '']),
    );
    const csv = rows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleRefreshFull = () => fetchFullUsers();

  const handleToggleDetails = (id: string) => {
    setSelectedUserId((prev) => (prev === id ? null : id));
  };

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    role?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  // Validação de formulário
  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
    } = {};

    if (!formData.username) {
      newErrors.username = 'Nome de usuário obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (!formData.role) {
      newErrors.role = 'Função obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Registro do usuário
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://infrawatch-backend.onrender.com/api';
  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setAuthError(null);

    try {
      const newUser = {
        username: formData.username, // campo correto
        email: formData.email,
        password: formData.password, // campo correto
        role: formData.role,
      };
      const res = await fetch(API_URL + '/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        // tenta ler JSON de erro, se falhar usa text()
        const err = await res
          .json()
          .catch(async () => ({ message: await res.text() }));
        setAuthError(err.error ?? err.message ?? `Erro: ${res.status}`);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      setAuthSuccess(data.message);
      // após resposta da API (supondo 'data.user' ou 'data.userId')
      const createdUser = { ...formData, id: data.userId };

      // adiciona uma cópia no topo e limita a 5
      setRecentUsers((prev) => [{ ...createdUser }, ...prev].slice(0, 5));

      // limpa o form via setter (não mutando)
      setFormData({ username: '', email: '', password: '', role: '' });

      setIsLoading(false);
    } catch (error: any) {
      console.error('Falha no request:', error);
      setAuthError(error?.message ?? String(error));
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger register (will run validation and submit)
    handleRegister();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-500';
      case 'operator':
        return 'bg-orange-500/20 text-orange-500';
      case 'viewer':
        return 'bg-white/20 text-white';
      default:
        return 'bg-neutral-500/20 text-neutral-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-white/20 text-white';
      case 'inactive':
        return 'bg-neutral-500/20 text-neutral-400';
      default:
        return 'bg-neutral-500/20 text-neutral-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            REGISTRO DE USUÁRIOS
          </h1>
          <p className="text-sm text-neutral-400">
            Gestão e cadastro de novos operadores do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={openUsers} onOpenChange={setOpenUsers}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:text-blue-600 text-white">
                Ver Lista Completa
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <div className="flex items-center justify-between w-full">
                  <DialogTitle>Lista de Usuários</DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleRefreshFull}
                      className="bg-neutral-700 hover:bg-neutral-600 text-white text-xs"
                    >
                      Atualizar
                    </Button>
                    <Button
                      onClick={handleExportCSV}
                      className="bg-neutral-700 hover:bg-neutral-600 text-white text-xs"
                    >
                      Exportar CSV
                    </Button>
                    <DialogClose asChild>
                      <Button className="bg-neutral-700 hover:bg-neutral-600 text-white">
                        Fechar
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome ou email"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white font-mono"
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white font-mono"
                >
                  <option value="all">Todas funções</option>
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="mt-4 space-y-2 max-h-72 overflow-auto">
                {isLoadingFull ? (
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Carregando usuários...
                  </div>
                ) : filteredUsers.length ? (
                  filteredUsers.map((u: any) => (
                    <div
                      key={u.id || u.email}
                      className="p-2 rounded hover:bg-neutral-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-white font-medium">
                            {u.username}
                          </div>
                          <div className="text-xs text-neutral-400 font-mono">
                            {u.email}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              getRoleColor(u.role) +
                              ' px-2 py-0.5 rounded text-xs font-mono'
                            }
                          >
                            {(u.role || '').toUpperCase()}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleToggleDetails(u.id)}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white text-xs"
                          >
                            Detalhes
                          </Button>
                        </div>
                      </div>
                      {selectedUserId === u.id && (
                        <div className="mt-2 text-sm text-neutral-300 font-mono border-t border-neutral-700 pt-2">
                          <div>ID: {u.id}</div>
                          <div>Função: {u.role}</div>
                          <div>Status: {u.status ?? 'active'}</div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-400">
                    Nenhum usuário encontrado.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  USUÁRIOS ATIVOS
                </p>
                <p className="text-2xl font-bold text-white font-mono">
                  {totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  ADMINISTRADORES
                </p>
                <p className="text-2xl font-bold text-red-500 font-mono">
                  {totalAdmins}
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  OPERADORES
                </p>
                <p className="text-2xl font-bold text-blue-500 font-mono">
                  {totalOperators}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  VISUALIZADORES
                </p>
                <p className="text-2xl font-bold text-white font-mono">
                  {totalViewers}
                </p>
              </div>
              <User className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white tracking-wider">
              NOVO USUÁRIO
            </CardTitle>
            <p className="text-sm text-neutral-400">
              Cadastrar novo operador no sistema
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-neutral-300 text-sm font-medium uppercase tracking-wide"
                >
                  USUÁRIO
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="nome.usuario"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange('username', e.target.value)
                    }
                    className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500 pl-10 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-neutral-300 text-sm font-medium uppercase tracking-wide"
                >
                  EMAIL
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@infrawatch.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500 pl-10 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-neutral-300 text-sm font-medium uppercase tracking-wide"
                >
                  SENHA
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    className="bg-neutral-800 border-neutral-600 text-white placeholder:text-neutral-500 pl-10 pr-10 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-neutral-300 text-sm font-medium uppercase tracking-wide"
                >
                  FUNÇÃO
                </Label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 z-10" />
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                  >
                    <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white pl-10 focus:border-orange-500 focus:ring-orange-500/20">
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-600">
                      <SelectItem
                        value="admin"
                        className="text-white hover:bg-neutral-700"
                      >
                        Admin (gestão completa do sistema)
                      </SelectItem>
                      <SelectItem
                        value="operator"
                        className="text-white hover:bg-neutral-700"
                      >
                        Operator (exibe e reage a alertas)
                      </SelectItem>
                      <SelectItem
                        value="viewer"
                        className="text-white hover:bg-neutral-700"
                      >
                        Viewer (somente leitura)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-400 mt-1">{errors.role}</p>
                  )}
                </div>
              </div>
              {authError && <InlineError message={authError} />}
              {authSuccess && <InlineSuccess message={authSuccess} />}
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium uppercase tracking-wide"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    CRIANDO USUÁRIO...
                  </div>
                ) : (
                  'CRIAR USUÁRIO'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white tracking-wider">
              USUÁRIOS RECENTES
            </CardTitle>
            <p className="text-sm text-neutral-400">
              Últimos usuários cadastrados no sistema
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingRegister && (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  CRIANDO USUÁRIO...
                </div>
              )}
              {recentUsers &&
                recentUsers.map((user) => (
                  <div
                    key={user?.id}
                    className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg border border-neutral-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.username}
                        </p>
                        <p className="text-xs text-neutral-400 font-mono">
                          {user.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(user?.role)}>
                        {user.role.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor('active')}>ACTIVE</Badge>
                      {/* <Badge className={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge> */}
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-700">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Clock className="w-3 h-3" />
                <span>
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

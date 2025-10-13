"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Pencil, Trash, Search, Filter, Download } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { listAllUsers, handleCreateUser, deleteUser, updateUser } from "../../../../services/userService";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  status: "active" | "inactive";
  createdAt?: string;
  lastLogin?: string;
}

const ROLES = {
  admin: "Administrador",
  operator: "Operador",
  viewer: "Visualizador",
} as const;

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800 hover:bg-green-100",
  inactive: "bg-red-100 text-red-800 hover:bg-red-100",
} as const;

const ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-800",
  operator: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-100 text-gray-800",
} as const;

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUserCreateDialogOpen, setIsUserCreateDialogOpen] = useState(false);
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "" as "admin" | "operator" | "viewer" | "",
  });
  
  const [editUserForm, setEditUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "" as "admin" | "operator" | "viewer" | "",
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof newUserForm, string>>>({});

  // Load users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const users = await listAllUsers();
      const mapped = users.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        status: u.status || "active",
        createdAt: u.createdAt,
        //lastLogin: u.lastLogin,
      }));
      setAllUsers(mapped);
      setFilteredUsers(mapped);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
        toast({
                title: "Erro",
                description: "Falha ao carregar lista de usuários" 
        })
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users
  useEffect(() => {
    let filtered = allUsers;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, allUsers]);

  // Validate form
  const validateForm = (form: typeof newUserForm | typeof editUserForm, isEdit = false) => {
    const errors: Partial<Record<keyof typeof newUserForm, string>> = {};
    
    if (!form.username) {
      errors.username = "Nome de usuário é obrigatório";
    } else if (form.username.length < 3) {
      errors.username = "Nome deve ter pelo menos 3 caracteres";
    }
    
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email válido é obrigatório";
    }
    
    if (!isEdit && (!form.password || form.password.length < 6)) {
      errors.password = "Senha deve ter pelo menos 6 caracteres";
    } else if (isEdit && form.password && form.password.length < 6) {
      errors.password = "Senha deve ter pelo menos 6 caracteres";
    }
    
    if (!form.role) {
      errors.role = "Função é obrigatória";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create user
  const handleCreateUserAction = async () => {
    if (!validateForm(newUserForm)) {
         toast({
                title: "Alerta",
                description: "Por favor, corrija os erros no formulário",
                variant: "destructive",
        })
      return;
    }
    try {
      await handleCreateUser(newUserForm, setIsLoading, setAuthError);
       toast({
        title: "Sucesso!",
        description: `Usuário ${newUserForm.username} criado com sucesso`,
      })
      await fetchUsers();
      setIsUserCreateDialogOpen(false);
      setNewUserForm({ username: "", email: "", password: "", role: ""});
      setFormErrors({});
    } catch (error) {
        console.log(error);
         toast({
                title: "Erro",
                description: "Erro ao criar usuário",
                variant: "destructive",
        })
    }
  };

  // Edit user
  const handleEditUser = async () => {
    if (!selectedUser || !validateForm(editUserForm, true)) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    try {
      const updateData: Partial<UserData & { password: string }> = {};
      if (editUserForm.username !== selectedUser.username) updateData.username = editUserForm.username;
      if (editUserForm.email !== selectedUser.email) updateData.email = editUserForm.email;
      if (editUserForm.role !== selectedUser.role) updateData.role = editUserForm.role;
      if (editUserForm.password) updateData.password = editUserForm.password;

      await updateUser(selectedUser.id, updateData, setIsLoading, setAuthError);
      toast.success(`Usuário ${editUserForm.username} atualizado com sucesso`);
      await fetchUsers();
      setIsUserEditDialogOpen(false);
      setEditUserForm({ username: "", email: "", password: "", role: "" });
      setSelectedUser(null);
      setFormErrors({});
    } catch (error) {
      toast.error("Erro ao atualizar usuário");
    }
  };

  // Delete user
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id, setIsLoading);
       toast({
        title: "Sucesso!",
        description: `Usuário ${userToDelete.username} removido com sucesso`,
      })
      await fetchUsers();
      setUserToDelete(null);
    } catch (err) {
         toast({
                title: "Erro",
                description: "Erro ao remover usuário",
                variant: "destructive",
        })
    }
  };

  // Handle edit
  const handleEditAction = (user: UserData) => {
    setSelectedUser(user);
    setEditUserForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormErrors({});
    setIsUserEditDialogOpen(true);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  // Export users
  const exportUsers = () => {
    const csv = [
      ["Usuário", "Email", "Função", "Status"],
      ...filteredUsers.map((u) => [u.username, u.email, ROLES[u.role], u.status === "active" ? "Ativo" : "Inativo"])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Lista de usuários exportada");
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Gerenciamento de Usuários</CardTitle>
                <CardDescription className="mt-1">
                  Gerencie usuários, funções e permissões do sistema
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportUsers}
                disabled={filteredUsers.length === 0}
                className="hover:bg-gray-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={isUserCreateDialogOpen} onOpenChange={setIsUserCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Criar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar um novo usuário no sistema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="username">Nome de Usuário *</Label>
                      <Input
                        id="username"
                        placeholder="Digite o nome de usuário"
                        value={newUserForm.username}
                        onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                        className={formErrors.username ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {formErrors.username && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite o email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        className={formErrors.email ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="password">Senha *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                        className={formErrors.password ? "border-red-500 focus:ring-red-500" : ""}
                      />
                      {formErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="role">Função *</Label>
                      <Select
                        value={newUserForm.role}
                        onValueChange={(value: "admin" | "operator" | "viewer") =>
                          setNewUserForm({ ...newUserForm, role: value })
                        }
                      >
                        <SelectTrigger id="role" className={formErrors.role ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecionar Função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">{ROLES.admin}</SelectItem>
                          <SelectItem value="operator">{ROLES.operator}</SelectItem>
                          <SelectItem value="viewer">{ROLES.viewer}</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.role && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button
                        onClick={handleCreateUserAction}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Criando...
                          </>
                        ) : (
                          "Criar Usuário"
                        )}
                      </Button>
                    </div>
                    {authError && (
                      <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{authError}</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Todas as funções" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as funções</SelectItem>
                <SelectItem value="admin">{ROLES.admin}</SelectItem>
                <SelectItem value="operator">{ROLES.operator}</SelectItem>
                <SelectItem value="viewer">{ROLES.viewer}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
              <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
                Limpar Filtros
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Exibindo {filteredUsers.length} de {allUsers.length} usuários
          </div>

          {isLoading && !allUsers.length ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-gray-500">Carregando usuários...</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Usuário</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Função</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">Nenhum usuário encontrado</p>
                        <p className="text-sm mt-1">Tente ajustar seus filtros de busca</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell className="text-gray-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={ROLE_COLORS[user.role]}>
                            {ROLES[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={STATUS_COLORS[user.status]}>
                            {user.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAction(user)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUserToDelete(user)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Edit User Dialog */}
          <Dialog open={isUserEditDialogOpen} onOpenChange={setIsUserEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Editar Usuário</DialogTitle>
                <DialogDescription>
                  Atualize as informações do usuário {selectedUser?.username}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="edit-username">Nome de Usuário *</Label>
                  <Input
                    id="edit-username"
                    placeholder="Digite o nome de usuário"
                    value={editUserForm.username}
                    onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                    className={formErrors.username ? "border-red-500 focus:ring-red-500" : ""}
                  />
                  {formErrors.username && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="Digite o email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    className={formErrors.email ? "border-red-500 focus:ring-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="Deixe em branco para manter a atual"
                    value={editUserForm.password}
                    onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                    className={formErrors.password ? "border-red-500 focus:ring-red-500" : ""}
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-role">Função *</Label>
                  <Select
                    value={editUserForm.role}
                    onValueChange={(value: "admin" | "operator" | "viewer") =>
                      setEditUserForm({ ...editUserForm, role: value })
                    }
                  >
                    <SelectTrigger id="edit-role" className={formErrors.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecionar Função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{ROLES.admin}</SelectItem>
                      <SelectItem value="operator">{ROLES.operator}</SelectItem>
                      <SelectItem value="viewer">{ROLES.viewer}</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button
                    onClick={handleEditUser}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      "Atualizar Usuário"
                    )}
                  </Button>
                </div>
                {authError && (
                  <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{authError}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja remover o usuário <strong>{userToDelete?.username}</strong>?
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteUser}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Remover Usuário
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
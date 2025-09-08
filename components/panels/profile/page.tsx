// page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Users, UserPlus, Pencil, Trash } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// Import corrected functions from userLib.ts
import { listAllUsers, handleCreateUser, deleteUser, updateUser } from "./../../../services/userService"; // Adjust path as needed

interface UserData {
  id: string;
  username: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  status: "active" | "inactive";
}

const ROLES = {
  admin: "Administrador",
  operator: "Operador",
  viewer: "Visualizador",
} as const;

const STATUS_COLORS = {
  active: "text-green-500",
  inactive: "text-red-500",
} as const;

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isUserCreateDialogOpen, setIsUserCreateDialogOpen] = useState(false);
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
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
        status: u.status || "active", // Default to active if not provided
      }));
      setAllUsers(mapped);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      toast.error("Falha ao carregar lista de usuários");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Validate form
  const validateForm = (form: typeof newUserForm | typeof editUserForm, isEdit = false) => {
    const errors: Partial<Record<keyof typeof newUserForm, string>> = {};
    if (!form.username) errors.username = "Nome de usuário é obrigatório";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errors.email = "Email válido é obrigatório";
    if (!isEdit && (!form.password || form.password.length < 6)) errors.password = "Senha deve ter pelo menos 6 caracteres";
    if (!form.role) errors.role = "Função é obrigatória";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create user
  const handleCreateUserAction = async () => {
    if (!validateForm(newUserForm)) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    try {
      await handleCreateUser(newUserForm, setIsLoading, setAuthError);
      toast.success(`Usuário ${newUserForm.username} criado com sucesso`);
      await fetchUsers();
      setIsUserCreateDialogOpen(false);
      setNewUserForm({ username: "", email: "", password: "", role: ""});
      setFormErrors({});
    } catch (error) {
      toast.error("Erro ao criar usuário");
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

  // Handle user actions
  const handleUserAction = async (action: "edit" | "delete", user: UserData) => {
    if (action === "edit") {
      setSelectedUser(user);
      setEditUserForm({
        username: user.username,
        email: user.email,
        password: "",
        role: user.role,
      });
      setIsUserEditDialogOpen(true);
    } else if (action === "delete") {
      if (confirm(`Tem certeza que deseja remover o usuário ${user.username}?`)) {
        try {
          await deleteUser(user.id, setIsLoading);
          toast.success(`Usuário ${user.username} removido com sucesso`);
          await fetchUsers();
        } catch (err) {
          toast.error("Erro ao remover usuário");
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" aria-hidden="true" />
            <CardTitle className="text-2xl font-semibold">Gerenciamento de Usuários</CardTitle>
          </div>
          <Dialog open={isUserCreateDialogOpen} onOpenChange={setIsUserCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 transition-colors">
                <UserPlus className="w-4 h-4 mr-2" aria-hidden="true" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Criar Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    placeholder="Digite o nome de usuário"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    aria-invalid={!!formErrors.username}
                    aria-describedby="username-error"
                    className={formErrors.username ? "border-red-500" : ""}
                  />
                  {formErrors.username && (
                    <p id="username-error" className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite o email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    aria-invalid={!!formErrors.email}
                    aria-describedby="email-error"
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    aria-invalid={!!formErrors.password}
                    aria-describedby="password-error"
                    className={formErrors.password ? "border-red-500" : ""}
                  />
                  {formErrors.password && (
                    <p id="password-error" className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="role">Função</Label>
                  <Select
                    value={newUserForm.role}
                    onValueChange={(value: "admin" | "operator" | "viewer") =>
                      setNewUserForm({ ...newUserForm, role: value })
                    }
                  >
                    <SelectTrigger id="role" aria-invalid={!!formErrors.role} aria-describedby="role-error">
                      <SelectValue placeholder="Selecionar Função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{ROLES.admin}</SelectItem>
                      <SelectItem value="operator">{ROLES.operator}</SelectItem>
                      <SelectItem value="viewer">{ROLES.viewer}</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && (
                    <p id="role-error" className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button
                    onClick={handleCreateUserAction}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 transition-colors"
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
                {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading && !allUsers.length ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Usuário</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Função</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    allUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{ROLES[user.role]}</TableCell>
                        <TableCell>
                          <span className={STATUS_COLORS[user.status]}>
                            {user.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction("edit", user)}
                            aria-label={`Editar usuário ${user.username}`}
                            className="hover:bg-gray-200 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction("delete", user)}
                            aria-label={`Remover usuário ${user.username}`}
                            className="hover:bg-red-100 transition-colors"
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {/* Edit User Dialog */}
              <Dialog open={isUserEditDialogOpen} onOpenChange={setIsUserEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Editar Usuário</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-username">Nome de Usuário</Label>
                      <Input
                        id="edit-username"
                        placeholder="Digite o nome de usuário"
                        value={editUserForm.username}
                        onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                        aria-invalid={!!formErrors.username}
                        aria-describedby="edit-username-error"
                        className={formErrors.username ? "border-red-500" : ""}
                      />
                      {formErrors.username && (
                        <p id="edit-username-error" className="text-red-500 text-sm mt-1">{formErrors.username}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        placeholder="Digite o email"
                        value={editUserForm.email}
                        onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                        aria-invalid={!!formErrors.email}
                        aria-describedby="edit-email-error"
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      {formErrors.email && (
                        <p id="edit-email-error" className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
                      <Input
                        id="edit-password"
                        type="password"
                        placeholder="Digite a nova senha"
                        value={editUserForm.password}
                        onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                        aria-describedby="edit-password-error"
                        className={formErrors.password ? "border-red-500" : ""}
                      />
                      {formErrors.password && (
                        <p id="edit-password-error" className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="edit-role">Função</Label>
                      <Select
                        value={editUserForm.role}
                        onValueChange={(value: "admin" | "operator" | "viewer") =>
                          setEditUserForm({ ...editUserForm, role: value })
                        }
                      >
                        <SelectTrigger id="edit-role" aria-invalid={!!formErrors.role} aria-describedby="edit-role-error">
                          <SelectValue placeholder="Selecionar Função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">{ROLES.admin}</SelectItem>
                          <SelectItem value="operator">{ROLES.operator}</SelectItem>
                          <SelectItem value="viewer">{ROLES.viewer}</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.role && (
                        <p id="edit-role-error" className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                      )}
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button
                        onClick={handleEditUser}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 transition-colors"
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
                    {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
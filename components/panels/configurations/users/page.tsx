'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, Download, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  listAllUsers,
  handleCreateUser,
  deleteUser,
  updateUser,
} from '../../../../services/userService';

import UserFilters from './UserFilters';
import UserTable from './UserTable';
import UserFormDialog from './UserFormDialogProps';
import DeleteUserDialog from './DeleteUserDialogProps';

import { useUserFilters } from './UserData';
import { useUserForm } from './UserFormData';
import { BlockUserDialog, UnBlockUserDialog } from './BlockUserDialogProps';
import CompanyInfoSidebar from './CompanyInfoSidebar';
import { ROLES, UserData } from '@/interfaces/IUser';


export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [userToBlock, setUserToBlock] = useState<UserData | null>(null);
  const [userToUnBlock, setUserToUnBlock] = useState<UserData | null>(null);
  const iam = localStorage.getItem('user');
  const currentUserEmail = iam ? JSON.parse(iam).email : null;

  // Custom hooks
  const {
    searchTerm,
    roleFilter,
    statusFilter,
    filteredUsers,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    resetFilters,
  } = useUserFilters(allUsers);

  const createForm = useUserForm();
  const editForm = useUserForm();

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
        status: u.status,
        createdAt: u.createdAt,
      }));
      setAllUsers(mapped);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar lista de usuários',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Create user
  const handleCreateUserAction = async () => {
    if (!createForm.validateForm()) {
      toast({
        title: 'Alerta',
        description: 'Por favor, corrija os erros no formulário',
        variant: 'destructive',
      });
      return;
    }
    try {
      const payload = {
        ...createForm.formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any;
      await handleCreateUser(payload, setIsLoading, setAuthError);
      await fetchUsers();
      toast({
        title: 'Sucesso!',
        description: `Usuário ${createForm.formData.username} criado com sucesso`,
      });
      setIsCreateDialogOpen(false);
      createForm.resetForm();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar usuário',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !editForm.validateForm(true)) {
      toast({
        title: 'Alerta',
        description: 'Por favor, corrija os erros no formulário',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updateData: Partial<UserData & { password: string }> = {};
      if (editForm.formData.username !== selectedUser.username)
        updateData.username = editForm.formData.username;
      if (editForm.formData.email !== selectedUser.email)
        updateData.email = editForm.formData.email;
      if (
        editForm.formData.role !== selectedUser.role &&
        editForm.formData.role !== ''
      ) {
        updateData.role = editForm.formData.role as
          | 'admin'
          | 'operator'
          | 'viewer';
      }
      if (editForm.formData.password)
        updateData.password = editForm.formData.password;

      await updateUser(selectedUser.id, updateData, setIsLoading, setAuthError);
      await fetchUsers();
      toast({
        title: 'Sucesso!',
        description: `Usuário ${editForm.formData.username} atualizado com sucesso`,
      });
      
      setIsEditDialogOpen(false);
      editForm.resetForm();
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar usuário',
        variant: 'destructive',
      });
    }
  };

  // Delete user
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id, setIsLoading);
      await fetchUsers();
      toast({
        title: 'Sucesso!',
        description: `Usuário ${userToDelete.username} removido com sucesso`,
      });
     
      setUserToDelete(null);
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao remover usuário',
        variant: 'destructive',
      });
    }
  };

  const confirmBlockUser = async () => {
    if (!userToBlock) return;
    try {
      await updateUser(
        userToBlock.id,
        { status: 'block' },
        setIsLoading,
        setAuthError,
      );
      await fetchUsers();
      toast({
        title: 'Sucesso!',
        description: `Usuário ${userToBlock.username} Bloqueado com sucesso`,
      });
      setUserToDelete(null);
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao remover usuário',
        variant: 'destructive',
      });
    }
  };

  const unBlockUser = async () => {
    if (!userToUnBlock) return;
    try {
      await updateUser(
        userToUnBlock.id,
        { status: 'active' },
        setIsLoading,
        setAuthError,
      );
      await fetchUsers();
      toast({
        title: 'Sucesso!',
        description: `Usuário ${userToUnBlock.username} desbloqueado com sucesso`,
      });
      setUserToDelete(null);
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao desbloquear o usuário',
        variant: 'destructive',
      });
    }
  };

  const handleEditAction = (user: UserData) => {
    setSelectedUser(user);
    editForm.resetForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const exportUsers = () => {
    const csv = [
      ['Usuário', 'Email', 'Função', 'Status'],
      ...filteredUsers.map((u) => [
        u.username,
        u.email,
        ROLES[u.role],
        u.status === 'active' ? 'Ativo' : 'Inativo',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({
      title: 'Sucesso!',
      description: 'Lista de usuários exportada',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <CompanyInfoSidebar
        companyData={{
          logo: './images.png',
          name: 'RCS Angola',
          industry: 'Tecnologia',
          foundedYear: '2020',
          address: 'Rua Comandante Arguelles',
          phone: '+244 932 896 190',
          email: 'info@rcsangola.co.ao',
          website: 'www.rcsangola.co.ao',
          employeeCount: 150,
          status: 'active',
        }}
      />
      <br />
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Gerenciamento de Usuários
                </CardTitle>
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
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <UserFormDialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                  title="Criar Novo Usuário"
                  description="Preencha os dados para criar um novo usuário no sistema"
                  formData={createForm.formData}
                  formErrors={createForm.formErrors}
                  isLoading={isLoading}
                  authError={authError}
                  onSubmit={handleCreateUserAction}
                  onFormChange={createForm.updateForm}
                />
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <UserFilters
            searchTerm={searchTerm}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onRoleChange={setRoleFilter}
            onStatusChange={setStatusFilter}
            onResetFilters={resetFilters}
          />

          <div className="mb-4 text-sm text-gray-600">
            Exibindo {filteredUsers.length} de {allUsers.length} usuários
          </div>

          {isLoading && !allUsers.length ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-gray-500">Carregando usuários...</p>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              currentUserEmail={currentUserEmail}
              onEdit={handleEditAction}
              onBlock={setUserToBlock}
              unBlock={setUserToUnBlock}
              onDelete={setUserToDelete}
            />
          )}

          <UserFormDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            title="Editar Usuário"
            description={`Atualize as informações do usuário ${selectedUser?.username}`}
            formData={editForm.formData}
            formErrors={editForm.formErrors}
            isLoading={isLoading}
            authError={authError}
            isEditMode
            onSubmit={handleEditUser}
            onFormChange={editForm.updateForm}
          />

          <DeleteUserDialog
            user={userToDelete}
            onConfirm={confirmDeleteUser}
            onCancel={() => setUserToDelete(null)}
          />

          <BlockUserDialog
            user={userToBlock}
            onConfirm={confirmBlockUser}
            onCancel={() => setUserToBlock(null)}
          />

          <UnBlockUserDialog
            user={userToUnBlock}
            onConfirm={unBlockUser}
            onCancel={() => setUserToUnBlock(null)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

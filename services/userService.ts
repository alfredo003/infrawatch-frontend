import api from '../lib/api';

export interface UserData {
  id?: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  created_at: string;
  updated_at: string;
  status?: 'active' | 'block' | 'registered';
}

export const handleCreateUser = async (
  formData: UserData & { password: string },
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
) => {
  setIsLoading(true);
  setAuthError(null);

  try {
    const response = await api.post('/users/create', {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (response.data.error) {
      console.log(response);
      setAuthError(response.data.error);
      setIsLoading(false);
      throw new Error(response.data.error);
    }
    setIsLoading(false);
    return response.data.user;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log('User creation failed:', msg);
    setAuthError('Erro ao registrar usuário: ' + msg);
    setIsLoading(false);
    throw error;
  }
};

export const listAllUsers = async (): Promise<UserData[]> => {
  try {
    const response = await api.get('/users');
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const deleteUser = async (
  id: string | undefined,
  setIsLoading: (loading: boolean) => void,
) => {
  if (!id) throw new Error('User ID is required');
  setIsLoading(true);
  try {
    const response = await api.delete(`/users/${id}`);
    setIsLoading(false);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar usuário com ID ${id}:`, error);
    setIsLoading(false);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  formData: Partial<UserData & { password: string }>,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
) => {
  setIsLoading(true);
  setAuthError(null);

  console.log(formData);
  try {
    const response = await api.patch(`/users/${id}`, formData);
    if (response.data.error) {
      setAuthError(response.data.error);
      throw new Error(response.data.error);
    }
    setIsLoading(false);
    return response.data.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log('User update failed:', msg);
    setAuthError('Erro ao atualizar usuário: ' + msg);
    setIsLoading(false);
    throw error;
  }
};

export const ResetPasswordUser = async (formData: {
  new_password: string;
  user_id: string;
}) => {
  try {
    const response = await api.patch(`/users/reset/password/`, formData);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log('User update failed:', msg);
    throw error;
  }
};

// Funções utilitárias para autenticação
export interface User {
  id: string;
  email: string;
}

export interface AuthData {
  token: string;
  user: User;
}

// Salvar dados de autenticação
export const saveAuthData = (authData: AuthData) => {
  localStorage.setItem('authToken', authData.token);
  localStorage.setItem('user', JSON.stringify(authData.user));
  
  // Também salvar nos cookies para o middleware
  document.cookie = `authToken=${authData.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 dias
};

// Recuperar token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Recuperar dados do usuário
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Verificar se está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Fazer logout
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Remover cookie
  document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Configurar cabeçalho de autorização para fetch
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

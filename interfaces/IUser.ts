
export interface UserData {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'registered' | 'block';
  createdAt?: string;
  lastLogin?: string;
}

export const ROLES = {
  admin: 'Administrador',
  operator: 'Operador',
  viewer: 'Visualizador',
} as const;
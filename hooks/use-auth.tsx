import { useState } from 'react';
import { getAuthToken, getUser, logout, type User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const token = typeof window !== 'undefined' ? getAuthToken() : null;
  const userData = typeof window !== 'undefined' ? getUser() : null;

  const [user, setUser] = useState<User | null>(userData);
  const [isAuthenticated, setIsAuthenticated] = useState(!!(token && userData));
  const [isLoading] = useState(false);
  const router = useRouter();

  const signOut = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return { user, isAuthenticated, isLoading, signOut };
}

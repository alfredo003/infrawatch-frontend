import { useState, useMemo } from 'react';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'registered' | 'block';
}

export function useUserFilters(allUsers: UserData[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    return filtered;
  }, [searchTerm, roleFilter, statusFilter, allUsers]);

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  return {
    searchTerm,
    roleFilter,
    statusFilter,
    filteredUsers,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    resetFilters,
  };
}

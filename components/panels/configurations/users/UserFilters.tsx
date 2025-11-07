import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ROLES = {
  admin: 'Administrador',
  operator: 'Operador',
  viewer: 'Visualizador',
} as const;

interface UserFiltersProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onResetFilters: () => void;
}

export default function UserFilters({
  searchTerm,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onResetFilters,
}: UserFiltersProps) {
  const hasActiveFilters =
    searchTerm || roleFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>
      <Select value={roleFilter} onValueChange={onRoleChange}>
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
      <Select value={statusFilter} onValueChange={onStatusChange}>
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
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onResetFilters}
          className="whitespace-nowrap"
        >
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}

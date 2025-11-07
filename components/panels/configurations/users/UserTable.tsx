import { memo } from 'react';
import { Users, Pencil, Trash, ShieldBan, ShieldMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'block' | 'registered';
  createdAt?: string;
  lastLogin?: string;
}

const ROLES = {
  admin: 'Administrador',
  operator: 'Operador',
  viewer: 'Visualizador',
} as const;

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 hover:bg-green-100',
  registered: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  block: 'bg-red-100 text-red-800 hover:bg-red-100',
} as const;

const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-800',
  operator: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800',
} as const;

interface UserTableProps {
  users: UserData[];
  currentUserEmail: string | null;
  onEdit: (user: UserData) => void;
  onBlock: (user: UserData) => void;
  unBlock: (user: UserData) => void;
  onDelete: (user: UserData) => void;
}

const UserTableRow = memo(
  ({
    user,
    isCurrentUser,
    onEdit,
    onBlock,
    unBlock,
    onDelete,
  }: {
    user: UserData;
    isCurrentUser: boolean;
    onEdit: () => void;
    onBlock: () => void;
    unBlock: () => void;
    onDelete: () => void;
  }) => (
    <TableRow
      className={`transition-colors hover:bg-gray-50 ${
        isCurrentUser ? 'bg-blue-50/70 border-l-4 border-blue-500' : ''
      }`}
    >
      <TableCell className="font-medium">
        <img
          src="./user_avatar.png"
          className="border rounded-sm"
          width={70}
          alt="Avatar"
        />
      </TableCell>
      <TableCell className="font-medium flex items-center gap-2">
        {user.username}
        {isCurrentUser && (
          <Badge className="bg-blue-100 text-blue-700">Você</Badge>
        )}
      </TableCell>
      <TableCell className="text-gray-600">{user.email}</TableCell>
      <TableCell>
        <Badge variant="secondary" className={ROLE_COLORS[user.role]}>
          {ROLES[user.role]}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className={STATUS_COLORS[user.status]}>
          {user.status === 'active'
            ? 'Ativo'
            : user.status === 'block'
              ? 'Bloqueado'
              : user.status === 'registered'
                ? 'Registrado'
                : 'Desconhecido'}
        </Badge>
      </TableCell>
      <TableCell className="text-right space-x-1">
        {isCurrentUser ? (
          <span className="text-sm text-gray-500 italic">Usuário atual</span>
        ) : (
          <>
            {user.status === 'block' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={unBlock}
                className="hover:bg-green-50 hover:text-green-600"
              >
                <ShieldMinus className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBlock}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <ShieldBan className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  ),
);

UserTableRow.displayName = 'UserTableRow';

export default function UserTable({
  users,
  currentUserEmail,
  onEdit,
  onBlock,
  unBlock,
  onDelete,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">*</TableHead>
              <TableHead className="font-semibold">Usuário</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Função</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-12"
              >
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">Nenhum usuário encontrado</p>
                <p className="text-sm mt-1">
                  Tente ajustar seus filtros de busca
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">*</TableHead>
            <TableHead className="font-semibold">Usuário</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Função</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              isCurrentUser={currentUserEmail === user.email}
              onEdit={() => onEdit(user)}
              onBlock={() => onBlock(user)}
              unBlock={() => unBlock(user)}
              onDelete={() => onDelete(user)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

const ROLES = {
  admin: 'Administrador',
  operator: 'Operador',
  viewer: 'Visualizador',
} as const;

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'operator' | 'viewer' | '';
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formData: UserFormData;
  formErrors: Partial<Record<keyof UserFormData, string>>;
  isLoading: boolean;
  authError: string | null;
  isEditMode?: boolean;
  onSubmit: () => void;
  onFormChange: (data: Partial<UserFormData>) => void;
}

export default function UserFormDialog({
  open,
  onOpenChange,
  title,
  description,
  formData,
  formErrors,
  isLoading,
  authError,
  isEditMode = false,
  onSubmit,
  onFormChange,
}: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="username">Nome de Usuário *</Label>
            <Input
              id="username"
              placeholder="Digite o nome de usuário"
              value={formData.username}
              onChange={(e) => onFormChange({ username: e.target.value })}
              className={
                formErrors.username ? 'border-red-500 focus:ring-red-500' : ''
              }
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
              value={formData.email}
              onChange={(e) => onFormChange({ email: e.target.value })}
              className={
                formErrors.email ? 'border-red-500 focus:ring-red-500' : ''
              }
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">
              {isEditMode ? 'Nova Senha (opcional)' : 'Senha'}
              {!isEditMode && (
                <small className="text-red-600"> (Padrão: 12345678)</small>
              )}
              {!isEditMode && ' *'}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={
                isEditMode
                  ? 'Deixe em branco para manter a atual'
                  : 'Mínimo 6 caracteres'
              }
              value={formData.password}
              onChange={(e) => onFormChange({ password: e.target.value })}
              className={
                formErrors.password ? 'border-red-500 focus:ring-red-500' : ''
              }
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>
          <div>
            <Label htmlFor="role">Função *</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'admin' | 'operator' | 'viewer') =>
                onFormChange({ role: value })
              }
            >
              <SelectTrigger
                id="role"
                className={formErrors.role ? 'border-red-500' : ''}
              >
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
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? 'Atualizando...' : 'Criando...'}
                </>
              ) : isEditMode ? (
                'Atualizar Usuário'
              ) : (
                'Criar Usuário'
              )}
            </Button>
          </div>
          {authError && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {authError}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

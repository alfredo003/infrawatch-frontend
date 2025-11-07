import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserData {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: any;
}

interface BlockUserDialogProps {
  user: UserData | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BlockUserDialog({
  user,
  onConfirm,
  onCancel,
}: BlockUserDialogProps) {
  return (
    <AlertDialog open={!!user} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar bloqueio</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja <strong>bloquear</strong> o usuário{' '}
            <strong>{user?.username}</strong>?<br />O usuário não poderá mais
            acessar o sistema até ser reativado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Bloquear Usuário
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function UnBlockUserDialog({
  user,
  onConfirm,
  onCancel,
}: BlockUserDialogProps) {
  return (
    <AlertDialog open={!!user} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar que deseja desbloquear</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja <strong>desbloquear</strong> o usuário{' '}
            <strong>{user?.username}</strong>?<br />O usuário voltara poder
            acessar o sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Desbloquear Usuário
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

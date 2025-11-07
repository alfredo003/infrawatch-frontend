import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-400 hover:text-blue-600 relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>🔔 Você recebeu uma nova mensagem</DropdownMenuItem>
        <DropdownMenuItem>📅 Reunião às 15h</DropdownMenuItem>
        <DropdownMenuItem>⚠️ Servidor em manutenção</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-blue-600">Ver todas</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

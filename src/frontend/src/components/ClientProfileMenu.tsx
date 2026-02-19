import { useClientAuth } from '../hooks/useClientAuth';
import { useNavigate } from '@tanstack/react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export default function ClientProfileMenu() {
  const { clientData, logout } = useClientAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  if (!clientData) return null;

  const initials = clientData.nome
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border border-neon-green/30 hover:bg-neon-green/10"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-neon-green/20 text-neon-green font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-neon-green/20 bg-card-dark" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-neon-green">{clientData.nome}</p>
            <p className="text-xs leading-none text-muted-foreground">ID: {clientData.idLuid}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neon-green/20" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Desconectar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

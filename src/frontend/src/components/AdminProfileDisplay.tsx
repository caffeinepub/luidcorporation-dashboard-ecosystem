import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Shield } from 'lucide-react';

export default function AdminProfileDisplay() {
  const { adminUsername } = useAdminAuth();

  const getInitials = (name: string) => {
    return name
      .split(/\s+/)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-neon-green/20 bg-carbon-black px-3 py-2">
      <Avatar className="h-8 w-8 border border-neon-green/30">
        <AvatarFallback className="bg-neon-green/10 text-neon-green">
          {getInitials(adminUsername || 'Admin')}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-neon-green">{adminUsername}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          Administrador
        </span>
      </div>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { useChatSystemStatus } from '../hooks/useQueries';
import { Circle, Loader2 } from 'lucide-react';

export default function ChatSystemStatusIndicator() {
  const { data: status, isLoading } = useChatSystemStatus();

  if (isLoading) {
    return (
      <Card className="border-neon-green/20 bg-card-dark">
        <CardContent className="flex items-center gap-3 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-neon-green" />
          <span className="text-sm text-muted-foreground">Carregando status...</span>
        </CardContent>
      </Card>
    );
  }

  const isOnline = status === 'online';

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardContent className="flex items-center gap-3 p-4">
        <Circle 
          className={`h-4 w-4 ${isOnline ? 'fill-neon-green text-neon-green' : 'fill-red-500 text-red-500'}`}
        />
        <div>
          <div className={`text-sm font-medium ${isOnline ? 'text-neon-green' : 'text-red-500'}`}>
            Chat {isOnline ? 'Online' : 'Offline'}
          </div>
          <div className="text-xs text-muted-foreground">
            {isOnline ? 'Sistema de chat disponível' : 'Sistema de chat indisponível'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

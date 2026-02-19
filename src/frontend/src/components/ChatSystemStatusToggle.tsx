import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useChatSystemStatus, useSetChatSystemStatus } from '../hooks/useQueries';
import { MessageCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ChatSystemStatus } from '../backend';

export default function ChatSystemStatusToggle() {
  const { data: status, isLoading } = useChatSystemStatus();
  const setChatStatus = useSetChatSystemStatus();

  const handleStatusChange = async (value: string) => {
    try {
      await setChatStatus.mutateAsync(value as ChatSystemStatus);
      toast.success(`Chat ${value === 'online' ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      toast.error('Erro ao alterar status do chat');
    }
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <MessageCircle className="h-5 w-5" />
          Controle do Chat
        </CardTitle>
        <CardDescription>
          Ative ou desative o sistema de chat para clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
          </div>
        ) : (
          <RadioGroup
            value={status || 'offline'}
            onValueChange={handleStatusChange}
            disabled={setChatStatus.isPending}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border border-neon-green/20 p-3 transition-colors hover:bg-neon-green/5">
              <RadioGroupItem value="online" id="online" className="border-neon-green text-neon-green" />
              <Label htmlFor="online" className="flex-1 cursor-pointer">
                <div className="font-medium text-neon-green">Online</div>
                <div className="text-xs text-muted-foreground">
                  Clientes podem enviar mensagens
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border border-neon-green/20 p-3 transition-colors hover:bg-neon-green/5">
              <RadioGroupItem value="offline" id="offline" className="border-neon-green text-neon-green" />
              <Label htmlFor="offline" className="flex-1 cursor-pointer">
                <div className="font-medium text-red-500">Offline</div>
                <div className="text-xs text-muted-foreground">
                  Chat desativado para clientes
                </div>
              </Label>
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}

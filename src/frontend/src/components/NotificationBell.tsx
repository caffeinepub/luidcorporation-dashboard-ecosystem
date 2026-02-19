import { useState } from 'react';
import { useClientAuth } from '../hooks/useClientAuth';
import { useGlobalAnnouncement, useNotifications, useClearNotifications } from '../hooks/useQueries';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Megaphone, Mail, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationBell() {
  const { clientData } = useClientAuth();
  const { data: globalAnnouncement } = useGlobalAnnouncement();
  const { data: notifications, isLoading } = useNotifications(clientData?.idLuid || null);
  const clearNotifications = useClearNotifications();
  const [open, setOpen] = useState(false);

  const unreadCount = (notifications?.length || 0) + (globalAnnouncement && globalAnnouncement.trim() ? 1 : 0);

  const handleClearNotifications = async () => {
    if (!clientData?.idLuid) return;
    
    try {
      await clearNotifications.mutateAsync(clientData.idLuid);
      toast.success('Notificações limpas com sucesso!');
    } catch (error) {
      toast.error('Erro ao limpar notificações');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border border-neon-green/30 hover:bg-neon-green/10"
        >
          <Bell className="h-5 w-5 text-neon-green" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-neon-green text-carbon-black"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 border-neon-green/20 bg-card-dark p-0" align="end">
        <div className="flex items-center justify-between border-b border-neon-green/20 p-4">
          <h3 className="font-semibold text-neon-green">Notificações</h3>
          {notifications && notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearNotifications}
              disabled={clearNotifications.isPending}
              className="h-8 text-xs text-muted-foreground hover:text-neon-green"
            >
              {clearNotifications.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="mr-1 h-3 w-3" />
                  Limpar
                </>
              )}
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
            </div>
          ) : (
            <div className="p-2">
              {globalAnnouncement && globalAnnouncement.trim() && (
                <>
                  <div className="mb-2 px-2 py-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neon-green">
                      <Megaphone className="h-4 w-4" />
                      Avisos Globais
                    </div>
                  </div>
                  <div className="mb-2 rounded-lg border border-neon-green/20 bg-neon-green/5 p-3">
                    <p className="text-sm text-foreground">{globalAnnouncement}</p>
                  </div>
                  {notifications && notifications.length > 0 && (
                    <Separator className="my-3 bg-neon-green/20" />
                  )}
                </>
              )}

              {notifications && notifications.length > 0 && (
                <>
                  <div className="mb-2 px-2 py-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neon-green">
                      <Mail className="h-4 w-4" />
                      Mensagens Individuais
                    </div>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-neon-green/20 bg-carbon-black p-3 hover:bg-neon-green/5 transition-colors"
                      >
                        <p className="text-sm text-foreground">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!globalAnnouncement?.trim() && (!notifications || notifications.length === 0) && (
                <div className="py-8 text-center">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">Nenhuma notificação</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

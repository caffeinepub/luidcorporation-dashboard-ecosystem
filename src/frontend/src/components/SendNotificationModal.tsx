import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAddNotification } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

interface SendNotificationModalProps {
  clientId: string;
  clientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SendNotificationModal({
  clientId,
  clientName,
  open,
  onOpenChange,
}: SendNotificationModalProps) {
  const [message, setMessage] = useState('');
  const addNotification = useAddNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Por favor, digite uma mensagem');
      return;
    }

    try {
      await addNotification.mutateAsync({ clientId, message: message.trim() });
      toast.success(`Notificação enviada para ${clientName}!`);
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao enviar notificação');
    }
  };

  const handleClose = () => {
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-neon-green/20 bg-card-dark sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-neon-green">Enviar Notificação</DialogTitle>
          <DialogDescription>
            Enviar mensagem individual para <span className="font-semibold text-neon-green">{clientName}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite a mensagem para o cliente..."
                className="min-h-[120px] border-neon-green/30 bg-carbon-black focus:border-neon-green resize-none"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-neon-green/30 text-foreground hover:bg-neon-green/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={addNotification.isPending || !message.trim()}
              className="bg-neon-green text-carbon-black hover:bg-neon-green/90"
            >
              {addNotification.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClientAuth } from '../hooks/useClientAuth';
import { useGetChatMessages, useSendChatMessage } from '../hooks/useQueries';
import { MessageCircle, Send, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { clientData } = useClientAuth();
  const { data: messages, isLoading } = useGetChatMessages(clientData?.idLuid || null);
  const sendMessage = useSendChatMessage();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !clientData) {
      return;
    }

    try {
      await sendMessage.mutateAsync({
        sender: clientData.idLuid,
        message: message.trim(),
      });
      setMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-neon-green p-0 text-carbon-black shadow-neon hover:bg-neon-green/90"
        title="Chat com suporte"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-neon-green/20 bg-card-dark sm:max-w-[450px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-neon-green">Chat com Suporte</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-neon-green"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            <ScrollArea className="h-[400px] rounded-md border border-neon-green/20 bg-carbon-black p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((msg, index) => {
                    const isClient = msg.sender === clientData?.idLuid;
                    return (
                      <div
                        key={index}
                        className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            isClient
                              ? 'bg-neon-green text-carbon-black'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          {!isClient && (
                            <p className="mt-1 text-xs opacity-70">Suporte</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  <p>Nenhuma mensagem ainda.<br />Envie uma mensagem para iniciar o chat.</p>
                </div>
              )}
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
              />
              <Button
                type="submit"
                disabled={sendMessage.isPending || !message.trim()}
                className="bg-neon-green text-carbon-black hover:bg-neon-green/90"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

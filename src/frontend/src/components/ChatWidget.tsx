import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatMessages, useSendMessage } from '../hooks/useQueries';
import { useClientAuth } from '../hooks/useClientAuth';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { clientData } = useClientAuth();
  const { data: messages = [], isLoading } = useChatMessages(clientData?.idLuid || null);
  const sendMessage = useSendMessage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > lastMessageCount) {
      const newMessages = messages.slice(lastMessageCount);
      const hasNewAdminMessage = newMessages.some(msg => msg.sender === 'admin');
      if (hasNewAdminMessage && !isOpen) {
        // Show notification for new admin message
      }
    }
    setLastMessageCount(messages.length);
  }, [messages, lastMessageCount, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !clientData) return;

    try {
      await sendMessage.mutateAsync({
        sender: clientData.idLuid,
        receiver: 'admin',
        message: message.trim(),
      });
      setMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  const unreadCount = messages.filter(msg => msg.sender === 'admin').length;

  if (!clientData) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-neon-green p-0 text-carbon-black shadow-neon hover:bg-neon-green/90"
        title="Chat com Suporte"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 border-neon-green/20 bg-carbon-black shadow-neon">
          <CardHeader className="border-b border-neon-green/20 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-neon-green">
              <MessageCircle className="h-5 w-5" />
              Chat com Suporte
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4" ref={scrollRef}>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
                </div>
              ) : messages.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma mensagem ainda. Inicie uma conversa!
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, index) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={index}
                        className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            isAdmin
                              ? 'bg-neon-green/10 text-foreground'
                              : 'bg-neon-green text-carbon-black'
                          }`}
                        >
                          <div className="mb-1 text-xs font-semibold">
                            {isAdmin ? 'Suporte' : 'Você'}
                          </div>
                          <div className="text-sm">{msg.message}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="border-t border-neon-green/20 p-4">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="border-neon-green/30 bg-carbon-black focus:border-neon-green"
                  disabled={sendMessage.isPending}
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
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}

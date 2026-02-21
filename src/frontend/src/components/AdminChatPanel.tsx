import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAllClientRecords, useChatMessages, useSendMessage } from '../hooks/useQueries';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminChatPanel() {
  const { data: clients = [] } = useAllClientRecords();
  const sendMessage = useSendMessage();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages for selected client only
  const { data: messages = [], isLoading } = useChatMessages(selectedClientId);

  const selectedClient = clients.find(client => client.idLuid === selectedClientId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Simulate typing detection from client
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === selectedClientId) {
        setIsTyping(false);
      }
    }
  }, [messages, selectedClientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set typing indicator (simulated - in real app would send to backend)
    typingTimeoutRef.current = setTimeout(() => {
      // Typing stopped
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedClientId) return;

    try {
      await sendMessage.mutateAsync({
        sender: 'admin',
        receiver: selectedClientId,
        message: message.trim(),
      });
      setMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  const getUnreadCount = (clientId: string) => {
    // This is a simplified version - in a real app, you'd track read/unread status
    return 0;
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <MessageCircle className="h-5 w-5" />
          Gerenciamento de Chat
        </CardTitle>
        <CardDescription>
          Visualize e responda às mensagens dos clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Client List */}
          <div className="lg:col-span-1">
            <ScrollArea className="h-[500px] rounded-md border border-neon-green/20 bg-carbon-black p-2">
              {clients.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum cliente cadastrado
                </div>
              ) : (
                <div className="space-y-2">
                  {clients.map((client) => {
                    const unreadCount = getUnreadCount(client.idLuid);
                    const isSelected = selectedClientId === client.idLuid;
                    return (
                      <button
                        key={client.idLuid}
                        onClick={() => setSelectedClientId(client.idLuid)}
                        className={`w-full rounded-lg border p-3 text-left transition-colors ${
                          isSelected
                            ? 'border-neon-green bg-neon-green/10'
                            : 'border-neon-green/20 hover:bg-neon-green/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-foreground">{client.nome}</div>
                            <div className="text-xs text-muted-foreground">{client.idLuid}</div>
                          </div>
                          {unreadCount > 0 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-green text-xs font-bold text-carbon-black">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedClientId && selectedClient ? (
              <div className="flex h-[500px] flex-col rounded-md border border-neon-green/20 bg-carbon-black">
                <div className="border-b border-neon-green/20 p-4">
                  <div className="font-medium text-neon-green">{selectedClient.nome}</div>
                  <div className="text-xs text-muted-foreground">ID: {selectedClient.idLuid}</div>
                </div>

                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.map((msg, index) => {
                        const isAdmin = msg.sender === 'admin';
                        return (
                          <div
                            key={index}
                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                                isAdmin
                                  ? 'bg-neon-green text-carbon-black'
                                  : 'bg-neon-green/10 text-foreground'
                              }`}
                            >
                              <div className="mb-1 text-xs font-semibold">
                                {isAdmin ? 'Você (Admin)' : selectedClient.nome}
                              </div>
                              <div className="text-sm">{msg.message}</div>
                            </div>
                          </div>
                        );
                      })}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg bg-neon-green/10 px-3 py-2">
                            <div className="mb-1 text-xs font-semibold text-foreground">
                              {selectedClient.nome}
                            </div>
                            <div className="flex gap-1">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-neon-green [animation-delay:-0.3s]"></span>
                              <span className="h-2 w-2 animate-bounce rounded-full bg-neon-green [animation-delay:-0.15s]"></span>
                              <span className="h-2 w-2 animate-bounce rounded-full bg-neon-green"></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Nenhuma mensagem ainda
                    </div>
                  )}
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="border-t border-neon-green/20 p-4">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={handleInputChange}
                      placeholder="Digite sua resposta..."
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
              </div>
            ) : (
              <div className="flex h-[500px] items-center justify-center rounded-md border border-neon-green/20 bg-carbon-black text-muted-foreground">
                Selecione um cliente para visualizar a conversa
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatMessages, useSendMessage, useChatSystemStatus } from '../hooks/useQueries';
import { useClientAuth } from '../hooks/useClientAuth';
import { MessageCircle, X, Send, Loader2, Circle, Check, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { formatMessageTime } from '../utils/timeFormatters';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { clientData } = useClientAuth();
  const { data: messages = [], isLoading } = useChatMessages(clientData?.idLuid || null);
  const { data: chatStatus } = useChatSystemStatus();
  const sendMessage = useSendMessage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isChatOffline = chatStatus === 'offline';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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

  // Simulate typing detection from admin
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'admin') {
      setIsTyping(false);
    }
  }, [messages]);

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
    if (!message.trim() || !clientData || isChatOffline) return;

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
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-neon-green p-0 text-carbon-black shadow-neon transition-all duration-300 hover:scale-110 hover:bg-neon-green/90"
        title="Chat com Suporte"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 border-neon-green/20 bg-card shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg text-neon-green">
                <MessageCircle className="h-5 w-5" />
                Chat com Suporte
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <Circle 
                  className={`h-2 w-2 ${isChatOffline ? 'fill-red-500 text-red-500' : 'fill-neon-green text-neon-green'}`} 
                />
                <span className={`text-xs font-medium ${isChatOffline ? 'text-red-500' : 'text-neon-green'}`}>
                  {isChatOffline ? 'Offline' : 'Online'}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96 p-4" ref={scrollRef}>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
                </div>
              ) : isChatOffline && messages.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mb-2 text-sm font-medium text-red-500">
                    Chat Indisponível
                  </div>
                  <div className="text-xs text-muted-foreground">
                    O chat está temporariamente offline. Tente novamente mais tarde.
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma mensagem ainda. Inicie uma conversa!
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, index) => {
                    const isAdmin = msg.sender === 'admin';
                    const isRead = !isAdmin && index < messages.length - 1;
                    return (
                      <div
                        key={index}
                        className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 shadow-sm ${
                            isAdmin
                              ? 'bg-muted text-foreground'
                              : 'bg-neon-green text-carbon-black'
                          }`}
                        >
                          <div className="mb-1 text-xs font-semibold">
                            {isAdmin ? 'Suporte' : 'Você'}
                          </div>
                          <div className="text-sm leading-relaxed">{msg.message}</div>
                          <div className={`mt-1 flex items-center gap-1 text-[10px] ${isAdmin ? 'text-muted-foreground' : 'text-carbon-black/70'}`}>
                            <span>{formatMessageTime(msg.timestamp)}</span>
                            {!isAdmin && (
                              <>
                                {isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg bg-muted px-3 py-2 shadow-sm">
                        <div className="mb-1 text-xs font-semibold text-foreground">Suporte</div>
                        <div className="flex gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-neon-green [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 animate-bounce rounded-full bg-neon-green [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 animate-bounce rounded-full bg-neon-green"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="border-t border-border p-4">
              {isChatOffline ? (
                <div className="rounded-md bg-red-500/10 p-3 text-center text-xs text-red-500">
                  O chat está offline no momento
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={handleInputChange}
                    placeholder="Digite sua mensagem..."
                    className="border-border bg-background focus:border-neon-green"
                    disabled={sendMessage.isPending || isChatOffline}
                  />
                  <Button
                    type="submit"
                    disabled={sendMessage.isPending || !message.trim() || isChatOffline}
                    className="bg-neon-green text-carbon-black hover:bg-neon-green/90"
                  >
                    {sendMessage.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}

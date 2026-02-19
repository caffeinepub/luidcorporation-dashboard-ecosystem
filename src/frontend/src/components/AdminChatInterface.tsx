import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAllClientRecords, useGetChatMessages, useSendChatMessage } from '../hooks/useQueries';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminChatInterface() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const { data: clients, isLoading: clientsLoading } = useAllClientRecords();
  const { data: messages, isLoading: messagesLoading } = useGetChatMessages(selectedClientId);
  const sendMessage = useSendChatMessage();

  const selectedClient = clients?.find((c) => c.idLuid === selectedClientId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !selectedClientId) {
      return;
    }

    try {
      await sendMessage.mutateAsync({
        sender: 'admin',
        message: message.trim(),
      });
      setMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  return (
    <Card className="border-neon-green/20 bg-card-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <MessageCircle className="h-5 w-5" />
          Chat com Clientes
        </CardTitle>
        <CardDescription>
          Selecione um cliente para visualizar e responder mensagens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="mb-2 text-sm font-semibold text-neon-green">Clientes</h3>
            <ScrollArea className="h-[400px] rounded-md border border-neon-green/20 bg-carbon-black">
              {clientsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
                </div>
              ) : clients && clients.length > 0 ? (
                <div className="space-y-1 p-2">
                  {clients.map((client) => (
                    <Button
                      key={client.idLuid}
                      variant={selectedClientId === client.idLuid ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        selectedClientId === client.idLuid
                          ? 'bg-neon-green text-carbon-black hover:bg-neon-green/90'
                          : 'text-foreground hover:bg-neon-green/10 hover:text-neon-green'
                      }`}
                      onClick={() => setSelectedClientId(client.idLuid)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{client.nome}</span>
                        <span className="text-xs opacity-70">{client.idLuid}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Nenhum cliente cadastrado
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="md:col-span-2">
            {selectedClient ? (
              <div className="flex flex-col space-y-4">
                <div className="rounded-md border border-neon-green/20 bg-carbon-black/50 p-3">
                  <h3 className="font-semibold text-neon-green">{selectedClient.nome}</h3>
                  <p className="text-xs text-muted-foreground">ID: {selectedClient.idLuid}</p>
                </div>

                <ScrollArea className="h-[300px] rounded-md border border-neon-green/20 bg-carbon-black p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-neon-green" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.map((msg, index) => {
                        const isAdmin = msg.sender === 'admin';
                        return (
                          <div
                            key={index}
                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                isAdmin
                                  ? 'bg-neon-green text-carbon-black'
                                  : 'bg-muted text-foreground'
                              }`}
                            >
                              <p className="text-sm">{msg.message}</p>
                              {!isAdmin && (
                                <p className="mt-1 text-xs opacity-70">Cliente</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                      <p>Nenhuma mensagem ainda</p>
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
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-md border border-neon-green/20 bg-carbon-black text-muted-foreground">
                <p>Selecione um cliente para visualizar o chat</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

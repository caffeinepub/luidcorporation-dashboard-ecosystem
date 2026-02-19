import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useNavigate } from '@tanstack/react-router';
import ClientRegistrationForm from '../components/ClientRegistrationForm';
import GlobalAnnouncementInput from '../components/GlobalAnnouncementInput';
import ClientList from '../components/ClientList';
import NetworkMonitoringToggle from '../components/NetworkMonitoringToggle';
import AdminChatPanel from '../components/AdminChatPanel';
import AdminProfileDisplay from '../components/AdminProfileDisplay';
import { LogOut, Shield } from 'lucide-react';

export default function AdminPanel() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin-login' });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-background">
      <header className="border-b border-neon-green/20 bg-carbon-black">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-neon-green" />
            <h1 className="text-xl font-bold text-neon-green">Luid Master Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <AdminProfileDisplay />
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Painel de Administração</h2>
          <p className="text-muted-foreground">
            Gerencie clientes, anúncios, chat e monitoramento de rede
          </p>
        </div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="border-neon-green/20 bg-carbon-black">
            <TabsTrigger value="clients" className="data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green">
              Gerenciar Clientes
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-neon-green/10 data-[state=active]:text-neon-green">
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <ClientRegistrationForm />
                <GlobalAnnouncementInput />
                <NetworkMonitoringToggle />
              </div>
              <div>
                <ClientList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <AdminChatPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

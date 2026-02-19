import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useNavigate } from '@tanstack/react-router';
import ClientRegistrationForm from '../components/ClientRegistrationForm';
import GlobalAnnouncementInput from '../components/GlobalAnnouncementInput';
import ClientList from '../components/ClientList';
import NetworkMonitoringToggle from '../components/NetworkMonitoringToggle';
import AdminChatInterface from '../components/AdminChatInterface';
import AdminMemberManagement from '../components/AdminMemberManagement';
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
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Painel de Administração</h2>
          <p className="text-muted-foreground">
            Gerencie clientes, anúncios, chat e administradores
          </p>
        </div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="admins">Administradores</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <ClientRegistrationForm />
              </div>
              <div>
                <ClientList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <AdminChatInterface />
          </TabsContent>

          <TabsContent value="admins">
            <div className="grid gap-6 lg:grid-cols-2">
              <AdminMemberManagement />
              <div className="rounded-lg border border-neon-green/20 bg-card-dark p-6">
                <h3 className="mb-4 text-lg font-semibold text-neon-green">Informações</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    • Adicione novos administradores usando o formulário ao lado
                  </p>
                  <p>
                    • Todos os administradores terão acesso completo ao painel
                  </p>
                  <p>
                    • As senhas devem ter pelo menos 6 caracteres
                  </p>
                  <p className="mt-4 rounded-md border border-yellow-600/30 bg-yellow-600/10 p-3 text-yellow-600">
                    <strong>Nota:</strong> A funcionalidade de listar, editar e remover administradores será implementada em uma atualização futura.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <GlobalAnnouncementInput />
              <NetworkMonitoringToggle />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useNavigate } from '@tanstack/react-router';
import ClientRegistrationForm from '../components/ClientRegistrationForm';
import GlobalAnnouncementInput from '../components/GlobalAnnouncementInput';
import ClientList from '../components/ClientList';
import NetworkMonitoringToggle from '../components/NetworkMonitoringToggle';
import EmployeeRegistrationForm from '../components/EmployeeRegistrationForm';
import EmployeeList from '../components/EmployeeList';
import { LogOut, Shield } from 'lucide-react';

export default function AdminPanel() {
  const { logout, isMaster, employeeId } = useAdminAuth();
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
            <div>
              <h1 className="text-xl font-bold text-neon-green">Luid Master Panel</h1>
              <p className="text-xs text-muted-foreground">
                Logado como: {employeeId} {isMaster && '(Master)'}
              </p>
            </div>
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
            {isMaster
              ? 'Gerencie clientes, funcionários, anúncios e monitoramento de rede'
              : 'Visualize clientes, anúncios e monitoramento de rede'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            {isMaster && (
              <>
                <ClientRegistrationForm />
                <GlobalAnnouncementInput />
                <NetworkMonitoringToggle />
              </>
            )}
            {!isMaster && (
              <>
                <GlobalAnnouncementInput />
                <NetworkMonitoringToggle />
              </>
            )}
          </div>
          <div className="space-y-6">
            <ClientList isMasterRole={isMaster} />
          </div>
        </div>

        {isMaster && (
          <>
            <Separator className="my-8 bg-neon-green/20" />
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-bold text-foreground">Catálogo de Funcionários</h2>
              <p className="text-muted-foreground">
                Gerencie os funcionários com acesso ao painel administrativo
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <EmployeeRegistrationForm />
              </div>
              <div>
                <EmployeeList />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
